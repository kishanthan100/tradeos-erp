from os import name
from pydantic import BaseModel, EmailStr
from datetime import datetime


class CreateUsers(BaseModel):
    name: str
    email: EmailStr
    role: str
    is_active: bool
    password: str

class UserSummary(BaseModel):
    name: str
    role: str
    email: str
    created_at: datetime
    is_active: bool