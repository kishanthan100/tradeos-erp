from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schema.customer_schema import CreateAddress, CreateCustomer
from app.service.customer_services import AddressService, CustomerService
from app.core.security import get_current_user



router = APIRouter(prefix="/api/customer", tags=["Customers"])



####################ADDRESS###################
@router.post("/create_address", status_code=status.HTTP_201_CREATED)
async def create_address(data: CreateAddress, db: AsyncSession = Depends(get_db),
                        current_user: str = Depends(get_current_user)):
    service = AddressService(db)
    return await service.create_address(data)

@router.get("/get_address", status_code=status.HTTP_200_OK)
async def get_address(db: AsyncSession = Depends(get_db),
                        current_user: str = Depends(get_current_user)):
    service = AddressService(db)
    return await service.get_all_address()




####################CUSTOMER###################
@router.post("/create_customer", status_code=status.HTTP_201_CREATED)
async def create_customer(data: CreateCustomer, db: AsyncSession = Depends(get_db),
                        current_user: str = Depends(get_current_user)):
    service = CustomerService(db)
    return await service.create_customer(data)


@router.get("/get_customer", status_code=status.HTTP_200_OK)
async def get_customer(db: AsyncSession = Depends(get_db), 
                        current_user: str = Depends(get_current_user)):
    service = CustomerService(db)
    return await service.get_all_customer()
