from re import A
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.model.customer_model import Customers, Address


class AddressRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Address]:
        result = await self.db.execute(select(Address))
        return list(result.scalars().all())


    async def create(self, no: str, street: str, city: str, country: str) -> Address:
        address = Address(
            no=no,
            street=street,
            city=city,
            country=country
        )
        self.db.add(address)
        await self.db.flush()    # writes to DB, gets the generated UUID back
                                 # but does NOT commit — service controls commit
        await self.db.refresh(address)  # loads generated fields (id, created_at)
        return address



class CustomerRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Customers]:
        result = await self.db.execute(select(Customers))
        return list(result.scalars().all())
    
    async def create_customer(self, name: str, email: str, contact_no: str, is_active: bool, address_id: int) -> Customers:
        customer = Customers(
            name=name,
            email=email,
            contact_no=contact_no,
            is_active=is_active,
            address_id=address_id



        )
        self.db.add(customer)
        await self.db.flush()    # writes to DB, gets the generated UUID back
                                 # but does NOT commit — service controls commit
        await self.db.refresh(customer)  # loads generated fields (id, created_at)
        return customer