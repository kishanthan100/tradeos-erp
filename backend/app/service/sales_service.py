from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.model.sales_model import Sales, SalesProduct
from app.repository.sales_repository import SalesRepository, SalesProductRepository
from app.repository.stock_repository import ProductRepository
from fastapi import HTTPException, status
from app.schema.sales_schema import CreateSales, SalesDetail,SalesItemDetail
from app.exeption.stock import InsufficientStockError
from uuid import UUID

class SalesService:
    def __init__(self, db: AsyncSession):
        self.sales_repo = SalesRepository(db)
        self.sales_product_repo = SalesProductRepository(db)
        self.product_repo = ProductRepository(db)

    async def get_all_sales(self) -> list[Sales]:
        return await self.sales_repo.get_all()


    async def create_sales(self, data: CreateSales) -> Sales:
        # Lock products in a consistent order (sorted by product_id) so that
        # two concurrent sales touching the same products can't deadlock
        # each other by acquiring row locks in reverse order.
        items_sorted = sorted(data.items, key=lambda i: i.product_id)

        # Validate + lock + deduct BEFORE creating the sale, so nothing is
        # written for an order that can't be fulfilled.
        locked_products = {}
        for item in items_sorted:
            product = await self.product_repo.get_for_update(item.product_id)

            if product.quantity_in_stock < item.quantity:
                raise InsufficientStockError(
                    product_id=item.product_id,
                    #product_name=product.name,
                    available=product.quantity_in_stock,
                    requested=item.quantity,
                )

            locked_products[item.product_id] = product

        # All items pass validation — safe to deduct + create everything.
        sale = await self.sales_repo.create(
            name=f"SAL-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            amount=data.amount,
            customer_id=data.customer_id,
        )

        for item in items_sorted:
            product = locked_products[item.product_id]
            product.quantity_in_stock -= item.quantity   # ORM-tracked, flushed on commit

            await self.sales_product_repo.create(
                sales_id=sale.id,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=item.total_price,
                product_id=item.product_id,
            )
        return sale



    async def get_sales_detail(self, sales_id: UUID) -> SalesDetail:
        rows = await self.sales_repo.get_by_id_with_items(sales_id)

        if not rows:
            raise HTTPException(status_code=404, detail="Sales order not found")

        return SalesDetail(
            
            amount=rows[0].amount,
            name=rows[0].name,
            items=[
                SalesItemDetail(
                    sku=row.sku,
                    quantity=row.quantity,
                    unit_price=row.unit_price,
                    total_price=row.total_price,
                    
                    
                )
                for row in rows
            ]
        )





class SalesProductService:
    def __init__(self, db: AsyncSession):
        self.repo = SalesProductRepository(db)

    async def get_all(self) -> list[SalesProduct]:
        return await self.repo.get_all()

    async def get_by_sales_id(self, sales_id: str) -> list[SalesProduct]:
        return await self.repo.get_by_sales_id(sales_id)
   