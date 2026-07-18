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
                Sales.id.label("sales_id"),
                Sales.name.label("sales_name"),
                Sales.amount,
                SalesProduct.quantity,
                SalesProduct.unit_price,
                SalesProduct.total_price,
                Product.id.label("product_id"),
                Product.sku,
                Customers.name,
            )
            
            .join(SalesProduct, SalesProduct.sales_id == Sales.id)
            .join(Product, Product.id == SalesProduct.product_id)
            .join(Customers, Customers.id == Sales.customer_id)
            .where(Sales.id == sales_id)
        )
        return result.all()


        
    
    async def get_sale_by_id(self, sales_id: UUID) -> Sales | None:
        result = await self.db.execute(
            select(Sales).where(Sales.id == sales_id)
        )
        return result.scalar_one_or_none()

    async def get_items_with_products_locked(
        self, sales_id: UUID, product_ids: list[UUID]
    ) -> list[tuple[SalesProduct, Product]]:
        """
        Locks both sales_products rows and their linked product rows
        together, sorted by product_id, so concurrent edits always
        acquire locks in the same order -> avoids deadlocks.
        """
        result = await self.db.execute(
            select(SalesProduct, Product)
            .join(Product, SalesProduct.product_id == Product.id)
            .where(
                SalesProduct.sales_id == sales_id,
                SalesProduct.product_id.in_(product_ids),
            )
            .order_by(SalesProduct.product_id)
            .with_for_update(of=[SalesProduct, Product])
        )
        return result.all()

    async def update_item(
        self, sales_product: SalesProduct, new_quantity: int, new_total_price: float
    ) -> None:
        sales_product.quantity = new_quantity
        sales_product.total_price = new_total_price
        self.db.add(sales_product)

    async def deduct_stock(self, product: Product, amount: int) -> None:
        product.quantity_in_stock -= amount
        self.db.add(product)

    async def update_sale_amount(self, sale: Sales, new_amount: float) -> None:
        sale.amount = new_amount
        self.db.add(sale)


    async def get_full_sale_with_items(self, sales_id: UUID) -> list[Row]:
        result = await self.db.execute(
            select(
                Sales.id.label("sales_id"),
                Sales.amount,
                Product.id.label("product_id"),
                Product.sku,
                SalesProduct.quantity,
                SalesProduct.unit_price,
                SalesProduct.total_price,
            )
            .join(SalesProduct, Sales.id == SalesProduct.sales_id)
            .join(Product, SalesProduct.product_id == Product.id)
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
            quantity=quantity,
            unit_price=unit_price,
            total_price=total_price,
            product_id=product_id,  
        )
        self.db.add(item)
        await self.db.flush()
        await self.db.refresh(item)
        return item
    
    

    
