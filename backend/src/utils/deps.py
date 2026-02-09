from typing import Generator
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from uuid import UUID

from src.database import get_db_session
from src.models.user import User
from src.utils.security import verify_token


def get_db() -> Generator[Session, None, None]:
    db = next(get_db_session())
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    """
    Get the currently authenticated user.
    Supports BOTH:
    - HTTP-only cookies (preferred)
    - Authorization: Bearer header (fallback)
    """

    token = None

    # 1️⃣ Try cookie first
    token = request.cookies.get("access_token")

    # 2️⃣ Fallback to Authorization header
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    payload = verify_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user_id = payload["sub"]

    user = db.query(User).filter(User.id == UUID(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user
