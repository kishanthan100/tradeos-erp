"""
models/__init__.py
------------------
Re-exports every model so Alembic's env.py only needs one import:

    from app.models import *

This is critical — if Alembic cannot see a model, it will not generate
a migration for that table even if the model file exists.
"""

from app.model.customer_model import Customers, Address
from app.model.stock_model import Category, Product


__all__ = [
    
    "Customers",
    "Address",
    "Category",
    "Product"
    
]