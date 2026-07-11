import asyncio
from app.db.session import get_db
from app.model.users_model import Users
from app.core.security import get_password_hash
from sqlalchemy import select
from app.core.security import settings

async def seed():
    async for db in get_db():
        result = await db.execute(select(Users))
        users = result.scalars().all()

        if not users:
            print("No users found — creating default admin...")
            admin = Users(
                name=settings.ADMIN_NAME,
                email=settings.ADMIN_EMAIL,
                password=get_password_hash(settings.ADMIN_PASSWORD),
                role=settings.ADMIN_ROLE,
                is_active=True,
            )
            db.add(admin)
            await db.commit()
            print("Admin user created ✅")
        else:
            print("Users already exist — skipping seed ✅")

asyncio.run(seed())