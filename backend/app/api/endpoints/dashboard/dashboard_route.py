from app.service.dashboard_service import DashboardService
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.security import get_current_user




router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/data")
async def get_dashboard_data(db: AsyncSession = Depends(get_db),
                            current_user: str = Depends(get_current_user)):
    dashboard_service = DashboardService(db)
    return await dashboard_service.get_dashboard_summary()
