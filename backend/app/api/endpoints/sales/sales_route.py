from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schema.sales_schema import CreateSales
from app.service.sales_service import SalesService
from uuid import UUID


router = APIRouter(prefix="/api/sales", tags=["Sales"])



####################SALES###################
@router.post("/create_sales", status_code=status.HTTP_201_CREATED)
async def create_sales(data: CreateSales, db: AsyncSession = Depends(get_db)):
    service = SalesService(db)
    sale = await service.create_sales(data)
    await db.commit()
    return sale

@router.get("/get_all_sales", status_code=status.HTTP_200_OK)
async def get_all_sales(db: AsyncSession = Depends(get_db)):
    service = SalesService(db)
    return await service.get_all_sales()

@router.get("/get_sales_detail/{sales_id}", status_code=status.HTTP_200_OK)
async def get_sales_detail(sales_id: UUID, db: AsyncSession = Depends(get_db)):
    service = SalesService(db)
    return await service.get_sales_detail(sales_id)




