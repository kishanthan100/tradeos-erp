from os import name
from pydantic import BaseModel

class CreateCategory(BaseModel):
    name: str
    country: str
    description: str

class CreateProduct(BaseModel):
    name: str
    sku: str
    description: str
    unit_price: float
    quantity_in_stock: int
    is_active: bool
    category_id: str
    