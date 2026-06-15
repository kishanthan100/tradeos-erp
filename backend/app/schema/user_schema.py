from os import name
from pydantic import BaseModel, EmailStr

class CreateUsers(BaseModel):
    name: str
    email: EmailStr
    role: str
    is_active: bool
    password: str
