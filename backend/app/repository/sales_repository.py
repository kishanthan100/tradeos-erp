from re import A
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.model.sales_model import Sales, SalesProduct
from datetime import datetime, timezone




class SalesRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Sales]:
        result = await self.db.execute(select(Sales))
        return list(result.scalars().all())

    async def get_by_id(self, id: str) -> Sales:
        result = await self.db.execute(select(Sales).where(Sales.id == id))
        return list(result.scalars().all())


    async def create(self,amount: float, customer_id: str) -> Sales:
        sales = Sales(
            name=f"SAL-{datetime.now().strftime('%Y%m%d%H%M%S')}", 
            amount=amount,
            customer_id=customer_id
        )
        self.db.add(sales)
        await self.db.flush()    # writes to DB, gets the generated UUID back
                                 # but does NOT commit — service controls commit
        await self.db.refresh(sales)  # loads generated fields (id, created_at)
        return sales



class SalesProductRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_all(self) -> list[SalesProduct]:
        result = await self.db.execute(select(SalesProduct))
        return list(result.scalars().all())

    async def get_sales_order_id(self, id: str) -> SalesProduct:
        result = await self.db.execute(select(SalesProduct).where(SalesProduct.id == id))
        return list(result.scalars().all())
    
    async def create(self, sales_id: str, product_id: str, quantity: int, total_price: float) -> SalesProduct:
        sales_product = SalesProduct(
            sales_id=sales_id,
            product_id=product_id,
            quantity=quantity,
            total_price=total_price
        )
        self.db.add(sales_product)
        await self.db.flush()    # writes to DB, gets the generated UUID back
                                 # but does NOT commit — service controls commit
        await self.db.refresh(sales_product)  # loads generated fields (id, created_at)
        return sales_product    
