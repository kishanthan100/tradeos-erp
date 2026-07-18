from re import A
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.schema.user_schema import UserSummary
from app.model.users_model import Users


class UserRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[UserSummary]:
        result = await self.db.execute(
            select(
                Users.id,
                Users.name,
                Users.role,
                Users.email,
                Users.created_at,
                Users.is_active,
            )
        )
        rows = result.mappings().all()
        return [UserSummary(**row) for row in rows]



        

    async def get_by_mail(self, email: str) -> Users:
        result = await self.db.execute(select(Users).where(Users.email == email))
        return list(result.scalars().all())


    async def create(self, name: str, email: str, role: str, is_active: bool, password: str) -> Users:
        user = Users(
            name=name,
            email=email,
            role=role,
            is_active=is_active,
            password=password
        )
        self.db.add(user)
        await self.db.flush()    # writes to DB, gets the generated UUID back
                                 # but does NOT commit — service controls commit
        await self.db.refresh(user)  # loads generated fields (id, created_at)
        return user