from re import A
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.model.stock_model import Category, Product
from app.exeption.stock import ProductNotFoundError


class CategoryRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Category]:
        result = await self.db.execute(select(Category))
        return list(result.scalars().all())


    async def create(self, name: str, country: str, description: str) -> Category:
        category = Category(
            name=name,
            country=country,
            description=description
        )
        self.db.add(category)
        await self.db.flush()    # writes to DB, gets the generated UUID back
                                 # but does NOT commit — service controls commit
        await self.db.refresh(category)  # loads generated fields (id, created_at)
        return category



class ProductRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Product]:
        result = await self.db.execute(select(Product))
        return list(result.scalars().all())
    

    async def create(self, name: str, sku: str, description: str, unit_price: float, quantity_in_stock: int, is_active: bool, category_id: str) -> Product:
        product = Product(
            name=name,
            sku=sku,
            description=description,
            unit_price=unit_price,
            quantity_in_stock=quantity_in_stock,
            is_active=is_active,
            category_id=category_id
        )
        self.db.add(product)
        await self.db.flush()    # writes to DB, gets the generated UUID back
                                 # but does NOT commit — service controls commit
        await self.db.refresh(product)  # loads generated fields (id, created_at)
        return product



    async def get_for_update(self, product_id: UUID) -> Product:
        """
        Locks the product row for the duration of this transaction.
        Any other transaction trying to read/lock the same row will
        block until this one commits or rolls back — prevents two
        concurrent sales from both reading stale stock and overselling.
        """
        stmt = select(Product).where(Product.id == product_id).with_for_update()
        result = await self.db.execute(stmt)
        product = result.scalar_one_or_none()
        if not product:
            raise ProductNotFoundError(product_id)
        return product