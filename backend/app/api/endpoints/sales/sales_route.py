from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schema.sales_schema import CreateSales, SaleUpdateRequest, SaleUpdateResponse
from app.service.sales_service import SalesService
from uuid import UUID
from app.core.security import get_current_user, require_admin

router = APIRouter(prefix="/api/sales", tags=["Sales"])



####################SALES###################
@router.post("/create_sales", status_code=status.HTTP_201_CREATED)
async def create_sales(data: CreateSales, db: AsyncSession = Depends(get_db),
                        current_user: str = Depends(require_admin)):
    service = SalesService(db)
    sale = await service.create_sales(data)
    await db.commit()
    return sale

@router.get("/get_all_sales", status_code=status.HTTP_200_OK)
async def get_all_sales(db: AsyncSession = Depends(get_db),
                        current_user: str = Depends(get_current_user)):
    service = SalesService(db)
    return await service.get_all_sales()

@router.get("/get_sales_detail/{sales_id}", status_code=status.HTTP_200_OK)
async def get_sales_detail(sales_id: UUID, db: AsyncSession = Depends(get_db),
                            current_user: str = Depends(get_current_user)):
    service = SalesService(db)
    return await service.get_sales_detail(sales_id)

@router.patch("/update-items/{sales_id}", response_model=SaleUpdateResponse)
async def update_sale_items(
    sales_id: UUID,
    payload: SaleUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> SaleUpdateResponse:

    service = SalesService(db)
    return await service.apply_additional_quantities(sales_id, payload)




