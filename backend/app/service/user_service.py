from sqlalchemy.ext.asyncio import AsyncSession
from app.model.users_model import Users
from app.repository.user_repository import UserRepository
from fastapi import HTTPException, status
from app.schema.user_schema import CreateUsers
from app.core.security import get_password_hash, verify_password

class UserService:

    def __init__(self, db: AsyncSession):
        self.repo = UserRepository(db)

    async def get_all_user(self) -> list[Users]:
        return await self.repo.get_all()

    

    async def create_user(self, data: CreateUsers) -> Users:
        user_exist = await self.repo.get_by_mail(data.email)
        if user_exist:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
        hashed_password = get_password_hash(data.password)

        return await self.repo.create(
            name=data.name,
            email=data.email,
            role=data.role,
            is_active=data.is_active,
            password=hashed_password
        )