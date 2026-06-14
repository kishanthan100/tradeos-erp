from sqlalchemy.ext.asyncio import AsyncSession
from app.model.customer_model import Address, Customers
from app.repository.customer_repository import AddressRepository, CustomerRepository
from fastapi import HTTPException, status
from app.schema.customer_schema import CreateAddress, CreateCustomer

class AddressService:

    def __init__(self, db: AsyncSession):
        self.repo = AddressRepository(db)

    async def get_all_address(self) -> list[Address]:
        return await self.repo.get_all()

    

    async def create_address(self, data: CreateAddress) -> Address:
        return await self.repo.create(
            no=data.no,
            street=data.street,
            city=data.city,
            country=data.country
        )

class CustomerService:
    def __init__(self, db: AsyncSession):
        self.repo = CustomerRepository(db)

    async def get_all_customer(self) -> list[Customers]:
        return await self.repo.get_all()

    async def create_customer(self, data: CreateCustomer) -> Customers:
        return await self.repo.create_customer(
            name=data.name,
            email=data.email,
            contact_no=data.contact_no,
            is_active=data.is_active,
            address_id=data.address_id
        )

   