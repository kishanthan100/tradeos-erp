from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from app.model.sales_model import Sales


class DashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_total_sales_amount(self) -> float:
        stmt = select(func.coalesce(func.sum(Sales.amount), 0))
        result = await self.db.execute(stmt)
        return result.scalar_one()

    async def get_sales_count(self) -> int:
        stmt = select(func.count(Sales.id))
        result = await self.db.execute(stmt)
        return result.scalar_one()

    async def get_sales_amount_by_year(self) -> list[dict]:
        stmt = (
            select(
                extract("day", Sales.created_at).label("day"),
                func.coalesce(func.sum(Sales.amount), 0).label("total_amount"),
            )
            .group_by(extract("day", Sales.created_at))
            .order_by(extract("day", Sales.created_at))
        )
        result = await self.db.execute(stmt)
        return [
            {"day": int(row.day), "total_amount": row.total_amount}
            for row in result.all()
        ]
