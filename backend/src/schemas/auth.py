from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class RegisterRequest(BaseModel):
    """
    Schema for user registration request.

    Attributes:
        email: User's email address (must be valid email format)
        password: User's password (minimum 8 characters will be validated in endpoint)
    """
    email: EmailStr
    password: str


class RegisterResponse(BaseModel):
    """
    Schema for user registration response.

    Attributes:
        id: Unique identifier of the created user
        email: Email address of the created user
        created_at: Timestamp when the user was created
    """
    id: str  # UUID as string
    email: EmailStr
    created_at: datetime


class LoginRequest(BaseModel):
    """
    Schema for user login request.

    Attributes:
        email: User's email address
        password: User's password
    """
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    """
    Schema for user login response.

    Attributes:
        access_token: JWT token for authentication
        token_type: Type of token (usually "bearer")
        user_id: Unique identifier of the authenticated user
        email: Email address of the authenticated user
    """
    access_token: str
    token_type: str
    user_id: str  # UUID as string
    email: EmailStr