import enum
import uuid
from sqlalchemy.dialects.postgresql import UUID

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin, UUIDMixin


class Users(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "users"

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

    role: Mapped[str] = mapped_column(
        sa.String(150),
        nullable=False,      
        index=True,            
        comment="role of a user — must be unique across all users",
    )

    password: Mapped[str] = mapped_column(
        sa.Text(),
        nullable=False,               
        comment="bcrypt hash — never store plain-text passwords",
    )
   

    is_active: Mapped[bool] = mapped_column(
        sa.Boolean,
        nullable=False,
        default=True,
        server_default=sa.true(),
        comment="Soft-disable a user without deleting their history",
    )