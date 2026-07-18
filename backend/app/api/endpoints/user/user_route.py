from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schema.user_schema import CreateUsers
from app.service.user_service import UserService
from app.core.security import get_current_user



router = APIRouter(prefix="/api/user", tags=["Users"])



####################ADDRESS###################
@router.post("/create_user", status_code=status.HTTP_201_CREATED)
async def create_user(data: CreateUsers, db: AsyncSession = Depends(get_db),
                        current_user: str = Depends(get_current_user)):
    service = UserService(db)
    return await service.create_user(data)

@router.get("/get_user", status_code=status.HTTP_200_OK)
async def get_users(db: AsyncSession = Depends(get_db),
                        current_user: str = Depends(get_current_user)):
    service = UserService(db)
    return await service.get_all_user()

