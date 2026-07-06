from fastapi import APIRouter, Depends, status, Response , HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
from typing import Annotated
from app.core.config import settings
from app.db.session import get_db
from app.schema.auth_schema import Login
from app.service.user_service import UserService
from app.core.security import create_access_token, get_current_user


router = APIRouter(prefix="/api", tags=["Auth"])



####################ADDRESS###################
@router.post("/login", status_code=status.HTTP_201_CREATED)
async def login(data: Login, response: Response, db: AsyncSession = Depends(get_db)):
    service = UserService(db)
    user = await service.login(data)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    access_token = create_access_token(data={"sub": user[0].email,
                                            "name": user[0].name,
                                            "role": user[0].role},
                                            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
                                            )
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True,   
        secure=settings.SECURE,     
        samesite="lax",
        max_age=86400
    )

    return {"access_token": access_token, "token_type": "bearer"}



@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out successfully"}


@router.get("/users/me/")
async def read_users_me(
    current_user: Annotated[str,Depends(get_current_user)]):
    return current_user

