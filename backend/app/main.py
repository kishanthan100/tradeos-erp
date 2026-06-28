from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy import text
from app.db.session import AsyncSessionLocal
from app.api.endpoints.customer import customer_route
from app.api.endpoints.stock import stock_route
from app.api.endpoints.user import user_route
from app.api.endpoints.sales import sales_route
from app.api.endpoints import auth
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Inventory API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],   # your React app's URL
    allow_credentials=True,                    # required for cookies (JWT)
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(customer_route.router)
app.include_router(stock_route.router)
app.include_router(user_route.router)
app.include_router(sales_route.router)



@app.middleware("http")
async def db_health_middleware(request: Request, call_next):
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
    except Exception:
        return JSONResponse(
            status_code=503,
            content={"status": "error", "message": "Database unavailable"}
        )
    return await call_next(request)
