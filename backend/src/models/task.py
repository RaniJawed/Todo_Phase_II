from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID

from sqlalchemy import event
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from .user import User


class TaskBase(SQLModel):
    """Base model for Task with common fields."""
    title: str = Field(min_length=1, max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    """Task model for the task management application."""
    id: int = Field(default=None, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id", index=True, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationship to User
    user: "User" = Relationship(back_populates="tasks")


# SQLAlchemy event listener to update the updated_at field before each update
@event.listens_for(Task, "before_update")
def update_updated_at(mapper, connection, target):
    target.updated_at = datetime.utcnow()