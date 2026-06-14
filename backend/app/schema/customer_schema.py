from pydantic import BaseModel

class CreateAddress(BaseModel):
    no: str
    street: str
    city: str
    country: str

class CreateCustomer(BaseModel):
    name: str
    email: str
    contact_no: str
    is_active: bool
    address_id: str
