from pydantic import BaseModel,Field, field_validator
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
    product_id: UUID
    sku: str
    quantity: int
    unit_price: float
    total_price: float
    

class SalesDetail(BaseModel):
    sales_id: UUID
    sales_name: str
    name: str
    amount: float
    items: list[SalesItemDetail]





class SaleItemUpdate(BaseModel):
    product_id: UUID
    additional_quantity: int = Field(ge=0)

class SaleUpdateRequest(BaseModel):
    items: list[SaleItemUpdate]

    @field_validator("items")
    @classmethod
    def not_empty(cls, v):
        if not v:
            raise ValueError("At least one item must be provided")
        return v

class SaleItemRead(BaseModel):
    product_id: UUID
    sku: str
    quantity: int
    unit_price: float
    total_price: float

class SaleUpdateResponse(BaseModel):
    sales_id: UUID
    amount: float
    items: list[SaleItemRead]