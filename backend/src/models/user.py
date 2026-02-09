from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import event
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .task import Task


class UserBase(SQLModel):
    """Base model for User with common fields."""
    email: str = Field(unique=True, index=True, nullable=False)


class User(UserBase, table=True):
    """User model for the task management application."""
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    password_hash: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationship to tasks
    tasks: list["Task"] = Relationship(back_populates="user")


# SQLAlchemy event listener to update the updated_at field before each update
@event.listens_for(User, "before_update")
def update_updated_at(target, value, oldvalue, initiator):
    target.updated_at = datetime.utcnow()