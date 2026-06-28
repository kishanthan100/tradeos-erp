from sqlalchemy.ext.asyncio import AsyncSession
from app.model.sales_model import Sales, SalesProduct
from app.repository.sales_repository import SalesRepository, SalesProductRepository
from fastapi import HTTPException, status
from app.schema.sales_schema import CreateSales, CreateSalesItem

class SalesService:

    def __init__(self, db: AsyncSession):
        self.repo = SalesRepository(db)
        self.product_repo = SalesProductRepository

    async def get_all_sales(self) -> list[Sales]:
        return await self.repo.get_all()

    

    async def create_sales(self, data: CreateSales) -> Sales:
        # 1. Create the sale record first to get its ID
        sale = await self.sales_repo.create(
            amount=data.amount,
            customer_id=data.customer_id,
        )

        # 2. Create each item using the new sale's ID
        for item in data.items:
            await self.product_repo.create(
                sales_id=sale.id,
                product_name=item.product_name,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=item.total_price,
            )

        return sale  # or return a response schema that includes items
    


class SalesProductService:

    def __init__(self, db: AsyncSession):
        self.repo = SalesProductRepository(db)

    async def get_all_sales(self) -> list[SalesProduct]:
        return await self.repo.get_all()

    

    async def create_sales(self, data: CreateSalesItem) -> SalesProduct:
        return await self.repo.create(
            product_name=data.product_name,
            quantity=data.quantity,
            unit_price=data.unit_price,
            sales_id=data.sales_id
            
        )


   