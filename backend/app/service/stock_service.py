from sqlalchemy.ext.asyncio import AsyncSession
from app.model.stock_model import Category, Product
from app.repository.stock_repository import CategoryRepository, ProductRepository
from fastapi import HTTPException, status
from app.schema.stock_schema import CreateCategory, CreateProduct

class CategoryService:

    def __init__(self, db: AsyncSession):
        self.repo = CategoryRepository(db)

    async def get_all_category(self) -> list[Category]:
        return await self.repo.get_all()

    

    async def create_category(self, data: CreateCategory) -> Category:
        return await self.repo.create(
            name=data.name,
            country=data.country,
            description=data.description
        )
    


class ProductService:

    def __init__(self, db: AsyncSession):
        self.repo = ProductRepository(db)

    async def get_all_product(self) -> list[Product]:
        return await self.repo.get_all()

    

    async def create_product(self, data: CreateProduct) -> Product:
        return await self.repo.create(
            name=data.name,
            sku=data.sku,
            description=data.description,
            unit_price=data.unit_price,
            quantity_in_stock=data.quantity_in_stock,
            is_active=data.is_active,
            category_id=data.category_id
        )


   