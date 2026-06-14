from sys import prefix
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schema.stock_schema import CreateCategory,CreateProduct
from app.service.stock_service import CategoryService, ProductService

router = APIRouter(prefix="/api/stock", tags=["Stock"])


####################CATEGORY###################
@router.post("/create_category", status_code=status.HTTP_201_CREATED)
async def create_address(data: CreateCategory, db: AsyncSession = Depends(get_db)):
    service = CategoryService(db)
    return await service.create_category(data)

@router.get("/get_all_category")
async def get_all_category(db: AsyncSession = Depends(get_db)):
    service = CategoryService(db)
    return await service.get_all_category()




####################PRODUCT###################
@router.post("/create_product", status_code=status.HTTP_201_CREATED)
async def create_address(data: CreateProduct, db: AsyncSession = Depends(get_db)):
    service = ProductService(db)
    return await service.create_product(data)


@router.get("/get_all_product")
async def get_product(db: AsyncSession = Depends(get_db)):
    service = ProductService(db)
    return await service.get_all_product()