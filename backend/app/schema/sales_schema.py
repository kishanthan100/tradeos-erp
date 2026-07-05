from pydantic import BaseModel
from uuid import UUID

class CreateSalesItem(BaseModel):
    
    quantity: int
    unit_price: float
    total_price: float
    product_id: UUID
    # No sales_id here — the service assigns it after creating the sale

class CreateSales(BaseModel):

    amount: float
    customer_id: str
    items: list[CreateSalesItem]  # one or many



class SalesItemDetail(BaseModel):
    sku: str
    quantity: int
    unit_price: float
    total_price: float
    

class SalesDetail(BaseModel):
    name: str
    amount: float
    items: list[SalesItemDetail]