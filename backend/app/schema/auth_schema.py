from pydantic import BaseModel, EmailStr
from datetime import datetime

class Login(BaseModel):
    email: EmailStr
    password: str

class CurrentUser(BaseModel):
    user_name: str | None
    user_email: str
    user_role: str | None