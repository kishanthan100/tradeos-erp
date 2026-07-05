class ProductNotFoundError(Exception):
    def __init__(self, product_id: str):
        self.product_id = product_id
        super().__init__(f"Product {product_id} not found")


class InsufficientStockError(Exception):
    def __init__(self, product_id: str, available: int, requested: int):
        self.product_id = product_id
        #self.product_name = product_name
        self.available = available
        self.requested = requested
        super().__init__(
            f"Insufficient stock for '{product_id}': {available} available, {requested} requested"
        )