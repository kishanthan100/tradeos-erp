"""
db/session.py
-------------
Async database engine and session factory.

Why async?
  FastAPI is an async framework. Using a synchronous SQLAlchemy engine
  (create_engine) blocks the entire event loop during every DB call —
  your app can only serve one request at a time while waiting for Postgres.
  With an async engine + asyncpg driver, DB calls are non-blocking.

Driver:
  asyncpg is the fastest PostgreSQL driver for Python async code.
  Connection string prefix: postgresql+asyncpg://

Session lifecycle (per request):
  Each HTTP request gets its own AsyncSession via the get_db() dependency.
  The session is committed on success and rolled back on any exception,
  then closed when the request finishes — regardless of outcome.
"""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings

# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------


engine = create_async_engine(
    settings.POSTGRES_URL,                # e.g. postgresql+asyncpg://user:pass@localhost:5432/inventory
    #echo=settings.DEBUG,                  # SQL logging only in dev
    pool_pre_ping=True,
    pool_size=10,                         # keep 10 connections ready
    max_overflow=20,                      # allow 20 extra under spike load
    pool_recycle=3600,                    # recycle connections every 1h
)


AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# ---------------------------------------------------------------------------
# FastAPI dependency — one session per request
# ---------------------------------------------------------------------------

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Yield a database session for the duration of a single HTTP request.

    Usage in a router:
        @router.get("/products")
        async def list_products(db: AsyncSession = Depends(get_db)):
            ...

    The session is automatically committed on clean exit and rolled back
    on any unhandled exception, then closed in all cases.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        # __aexit__ of async_sessionmaker closes the session automatically