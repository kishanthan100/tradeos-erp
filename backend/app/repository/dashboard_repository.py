from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from app.model.sales_model import Sales
from app.model.customer_model import Customers


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

    async def get_customers_count(self) -> int:
        stmt = select(func.count(Customers.id))
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

    async def get_top_customers_by_sales(self, limit: int = 5) -> list[dict]:
        total = func.coalesce(func.sum(Sales.amount), 0).label("total_amount")
        result = await self.db.execute(
            select(Customers.id, Customers.name, total)
            .outerjoin(Sales, Customers.id == Sales.customer_id)
            .group_by(Customers.id, Customers.name)
            .order_by(total.desc())
            .limit(limit)
        )
        return [dict(row._mapping) for row in result.all()]