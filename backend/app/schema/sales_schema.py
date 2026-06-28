from pydantic import BaseModel

class CreateSalesItem(BaseModel):
    product_name: str
    quantity: int
    unit_price: float
    total_price: float
    # No sales_id here — the service assigns it after creating the sale

class CreateSales(BaseModel):
    amount: float
    customer_id: str
    items: list[CreateSalesItem]  # one or many