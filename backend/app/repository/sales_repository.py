from re import A
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.model.sales_model import Sales, SalesProduct
from app.model.customer_model import Customers
from app.model.stock_model import Product
from sqlalchemy.engine import Row



class SalesRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Sales]:
        result = await self.db.execute(select(Sales))
        return list(result.scalars().all())

    async def get_by_id(self, id: str) -> Sales:
        result = await self.db.execute(select(Sales).where(Sales.id == id))
        return result.scalars().first()

    async def create(self, name: str, amount: float, customer_id: str) -> Sales:
        sale = Sales(name=name, amount=amount, customer_id=customer_id)
        self.db.add(sale)
        await self.db.flush()
        await self.db.refresh(sale)
        return sale
    
    async def get_by_id_with_items(self, sales_id: str) -> list[Row]:
        result = await self.db.execute(
            select(
                
                Sales.amount,
                SalesProduct.quantity,
                SalesProduct.unit_price,
                SalesProduct.total_price,
                Product.sku,
                Customers.name,
            )
            
            .join(SalesProduct, SalesProduct.sales_id == Sales.id)
            .join(Product, Product.id == SalesProduct.product_id)
            .join(Customers, Customers.id == Sales.customer_id)
            .where(Sales.id == sales_id)
        )
        return result.all()


class SalesProductRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[SalesProduct]:
        result = await self.db.execute(select(SalesProduct))
        return list(result.scalars().all())

    async def get_by_sales_id(self, sales_id: UUID) -> list[SalesProduct]:
        result = await self.db.execute(select(SalesProduct).where(SalesProduct.sales_id == sales_id))
        return list(result.scalars().all())

    async def create(self, sales_id: str, quantity: int, unit_price: float, total_price: float, product_id: str) -> SalesProduct:
        item = SalesProduct(
            sales_id=sales_id,
            #product_name=product_name,
            quantity=quantity,
            unit_price=unit_price,
            total_price=total_price,
            product_id=product_id,  
        )
        self.db.add(item)
        await self.db.flush()
        await self.db.refresh(item)
        return item
    
    

    
