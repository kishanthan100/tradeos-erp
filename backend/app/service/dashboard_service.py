from app.repository.dashboard_repository import DashboardRepository
from sqlalchemy.ext.asyncio import AsyncSession




class DashboardService:
    def __init__(self, db: AsyncSession):
        self.repo = DashboardRepository(db)

    async def get_dashboard_summary(self) -> dict:
        return {
            "total_sales_amount": await self.repo.get_total_sales_amount(),
            "sales_count": await self.repo.get_sales_count(),
            "sales_by_year": await self.repo.get_sales_amount_by_year(),
        }