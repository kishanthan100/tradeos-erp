from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schema.sales_schema import CreateSales, CreateSalesItem
from app.service.sales_service import Sales, SalesProduct


router = APIRouter(prefix="/api/sales", tags=["Sales"])



####################SALES###################
@router.post("/create_sales", status_code=status.HTTP_201_CREATED)
async def create_address(sales_data: CreateSales, product_data: CreateSalesItem , db: AsyncSession = Depends(get_db)):
    sales_service = Sales(db)
    sales = await sales_service.create_sales(sales_data)
    id = sales.id

    sales_product_service = SalesProduct(db)
    await sales_product_service.create_sales_product(product_data, id)



@router.get("/get_sales", status_code=status.HTTP_200_OK)
async def get_sales(db: AsyncSession = Depends(get_db)):
    service = Sales(db)
    return await service.get_all_sales()


