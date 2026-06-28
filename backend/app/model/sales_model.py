import enum
import uuid
from sqlalchemy.dialects.postgresql import UUID

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, UUIDMixin

# ---------------------------------------------------------------------------
# Model
# ---------------------------------------------------------------------------

class Sales(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "sales"

    # ── Columns ─────────────────────────────────────────────────────────────

    name: Mapped[str] = mapped_column(
        sa.String(100),
        nullable=False,
        unique=True,    # UNIQUE constraint + auto index
        comment="sales name — must be unique",
    )


    amount: Mapped[float] = mapped_column(
        sa.Numeric(12, 2),
        nullable=False,
        comment="Total Sales Amount",
    )

    customer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        sa.ForeignKey("customers.id", ondelete="RESTRICT"),
        nullable=False,
        comment="FK → customers.id",
    )



class SalesProduct(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "sales_products"

    # ── Columns ─────────────────────────────────────────────────────────────

    product_name: Mapped[str] = mapped_column(
        sa.String(150),
        nullable=False,
        unique=False,   # name search / ILIKE queries on product list
        comment="Product name — must be unique across all products",
    )
    quantity: Mapped[int] = mapped_column(
        sa.Integer,
        nullable=False,
        default=0,
        server_default="0",
        comment="Product quantity",
    )

    unit_price: Mapped[float] = mapped_column(
        sa.Numeric(12, 2),
        nullable=False,
        comment="Current selling price — stored in the sale_items at time of sale",
    )

    total_price: Mapped[float] = mapped_column(
        sa.Numeric(12, 2),
        nullable=False,
        comment="multiply unit_price , quantity — stored in the sale_items at time of sale",
    )

    sales_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        sa.ForeignKey("sales.id", ondelete="RESTRICT"),
        nullable=False,   # WHERE category_id = ? — list products in a category
        comment="FK → sales.id",
    )

    

