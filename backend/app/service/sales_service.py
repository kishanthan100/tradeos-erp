from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.model.sales_model import Sales, SalesProduct
from app.repository.sales_repository import SalesRepository, SalesProductRepository
from app.repository.stock_repository import ProductRepository
from fastapi import HTTPException, status
from app.schema.sales_schema import CreateSales, SalesDetail,SalesItemDetail, SaleUpdateRequest, SaleUpdateResponse, SaleItemRead
from app.exeption.stock import InsufficientStockError
from uuid import UUID
from decimal import Decimal

class SalesService:
    def __init__(self, db: AsyncSession):
        self.db=db
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
            sales_id=rows[0].sales_id,
            sales_name=rows[0].sales_name,
            amount=rows[0].amount,
            name=rows[0].name,
            items=[
                SalesItemDetail(
                    product_id=row.product_id,
                    sku=row.sku,
                    quantity=row.quantity,
                    unit_price=row.unit_price,
                    total_price=row.total_price,
                    
                    
                )
                for row in rows
            ]
        )







    async def apply_additional_quantities(
        self, sales_id: UUID, payload: SaleUpdateRequest
    ) -> SaleUpdateResponse:
        
        # 1. Sale must exist
        sale = await self.sales_repo.get_sale_by_id(sales_id)
        if sale is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sale not found",
            )

        requested_ids = [item.product_id for item in payload.items]
        requested_map = {item.product_id: item.additional_quantity for item in payload.items}

        # 2. Lock sales_products + products together
        rows = await self.sales_repo.get_items_with_products_locked(sales_id, requested_ids)

        found_ids = {sp.product_id for sp, _ in rows}
        missing_ids = set(requested_ids) - found_ids
        if missing_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"These products are not part of this sale: {missing_ids}",
            )

        # 3. Validate stock for every item BEFORE mutating anything
        stock_errors = []
        for sales_product, product in rows:
            additional_qty = requested_map[sales_product.product_id]
            if additional_qty > product.quantity_in_stock:
                stock_errors.append(
                    f"{product.sku}: requested {additional_qty}, "
                    f"only {product.quantity_in_stock} in stock"
                )

        if stock_errors:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={"message": "Insufficient stock", "errors": stock_errors},
            )
         # 4. Apply updates
        new_total_amount = Decimal("0")
        for sales_product, product in rows:
            additional_qty = requested_map[sales_product.product_id]

            if additional_qty > 0:
                new_quantity = sales_product.quantity + additional_qty
                new_total_price = new_quantity * sales_product.unit_price

                await self.sales_repo.update_item(sales_product, new_quantity, new_total_price)
                await self.sales_repo.deduct_stock(product, additional_qty)

                new_total_amount += new_total_price
            else:
                new_total_amount += sales_product.total_price

        await self.sales_repo.update_sale_amount(sale, new_total_amount)


        # 5. Single commit — all or nothing
        await self.db.commit()

        updated_rows = await self.sales_repo.get_full_sale_with_items(sales_id)
        return SaleUpdateResponse(
            sales_id=sales_id,
            amount=new_total_amount,
            items=[
                SaleItemRead(
                    product_id=r.product_id,
                    sku=r.sku,
                    quantity=r.quantity,
                    unit_price=r.unit_price,
                    total_price=r.total_price,
                )
                for r in updated_rows
            ],
        )










class SalesProductService:
    def __init__(self, db: AsyncSession):
        self.repo = SalesProductRepository(db)

    async def get_all(self) -> list[SalesProduct]:
        return await self.repo.get_all()

    async def get_by_sales_id(self, sales_id: str) -> list[SalesProduct]:
        return await self.repo.get_by_sales_id(sales_id)
   