from app.service.dashboard_service import DashboardService
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db



router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/data")
async def get_dashboard_data(db: AsyncSession = Depends(get_db)):
    dashboard_service = DashboardService(db)
    return await dashboard_service.get_dashboard_summary()
