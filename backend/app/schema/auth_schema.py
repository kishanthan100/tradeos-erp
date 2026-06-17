from pydantic import BaseModel, EmailStr
from datetime import datetime

class Login(BaseModel):
    email: EmailStr
    password: str
