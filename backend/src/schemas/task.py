from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: bool = False


class TaskCreateRequest(TaskBase):
    pass


class TaskUpdateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(default="", max_length=1000)
    completed: bool


class TaskPatchRequest(BaseModel):
    completed: Optional[bool] = None


class TaskResponse(TaskBase):
    id: int
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    # ✅ REQUIRED FOR ORM (Pydantic v2)
    model_config = {
        "from_attributes": True
    }


class TaskListResponse(BaseModel):
    tasks: List[TaskResponse]
    total: int = 0
