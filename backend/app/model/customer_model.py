import enum
import uuid
from sqlalchemy.dialects.postgresql import UUID

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, UUIDMixin

# ---------------------------------------------------------------------------
# Model
# ---------------------------------------------------------------------------

class Address(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "address"

    # ── Columns ─────────────────────────────────────────────────────────────

    no: Mapped[str] = mapped_column(
        sa.String(100),
        nullable=False,
        comment="Number of Home/office",
    )

    street: Mapped[str] = mapped_column(
        sa.String(100),
        nullable=False,
        comment="Street of Home/office",
    )

    city: Mapped[str] = mapped_column(
        sa.String(100),
        nullable=False,
        comment="City of Customer",
    )

    country: Mapped[str] = mapped_column(
        sa.String(100),
        nullable=False,
        comment="Country of Home/office",
    )




class Customers(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "customers"

    # ── Columns ─────────────────────────────────────────────────────────────

    name: Mapped[str] = mapped_column(
        sa.String(100),
        nullable=False,
        comment="Full display name",
    )

    email: Mapped[str] = mapped_column(
        sa.String(150),
        nullable=False,
        unique=True,           
        index=True,            
        comment="Login email — must be unique across all users",
    )

    contact_no: Mapped[str] = mapped_column(
        sa.String(150),
        nullable=False,
        unique=True,           
        index=True,            
        comment="contect number of user",
    )
   

    is_active: Mapped[bool] = mapped_column(
        sa.Boolean,
        nullable=False,
        default=True,
        server_default=sa.true(),
        comment="Soft-disable a user without deleting their history",
    )


    
    # ── Foreign keys ─────────────────────────────────────────────────────────

    address_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        sa.ForeignKey("address.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,    # WHERE category_id = ? — list products in a category
        comment="FK → address.id",
    )

