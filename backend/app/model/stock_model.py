import enum
import uuid
from sqlalchemy.dialects.postgresql import UUID

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, UUIDMixin

# ---------------------------------------------------------------------------
# Model
# ---------------------------------------------------------------------------

class Category(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "categories"

    # ── Columns ─────────────────────────────────────────────────────────────

    name: Mapped[str] = mapped_column(
        sa.String(100),
        nullable=False,
        unique=True,    # UNIQUE constraint + auto index
        comment="Category name — must be unique",
    )

    country: Mapped[str] = mapped_column(
        sa.String(100),
        nullable=False,
        unique=True,    # UNIQUE constraint + auto index
        comment="Category name — must be unique",
    )

    description: Mapped[str | None] = mapped_column(
        sa.Text,
        nullable=True,
        comment="Optional longer description",
    )



class Product(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "products"

    # ── Columns ─────────────────────────────────────────────────────────────

    name: Mapped[str] = mapped_column(
        sa.String(150),
        nullable=False,
        unique=True,   # DB-level UNIQUE — product names must be globally unique
        index=True,    # name search / ILIKE queries on product list
        comment="Product name — must be unique across all products",
    )

    sku: Mapped[str] = mapped_column(
        sa.String(60),
        nullable=False,
        unique=True,   # DB-level UNIQUE — SKU must never collide
        index=True,    # SKU lookup is the most precise product search
        comment="Stock Keeping Unit — unique internal product code e.g. ELEC-SAM-TV65",
    )

    description: Mapped[str | None] = mapped_column(
        sa.Text,
        nullable=True,
        comment="Optional product description shown in UI",
    )

    unit_price: Mapped[float] = mapped_column(
        sa.Numeric(12, 2),
        nullable=False,
        comment="Current selling price — stored in the sale_items at time of sale",
    )

    quantity_in_stock: Mapped[int] = mapped_column(
        sa.Integer,
        nullable=False,
        default=0,
        server_default="0",
        comment="Current quantity on hand — updated by StockMovement events",
    )

    

    is_active: Mapped[bool] = mapped_column(
        sa.Boolean,
        nullable=False,
        default=True,
        server_default=sa.true(),
        comment="Soft-delete — inactive products hidden from sales but history preserved",
    )


    
    # ── Foreign keys ─────────────────────────────────────────────────────────

    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        sa.ForeignKey("categories.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,    # WHERE category_id = ? — list products in a category
        comment="FK → category.id",
    )

