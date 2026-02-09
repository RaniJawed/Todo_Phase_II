from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from src.utils.security import verify_token
from src.models.user import User
from sqlalchemy.orm import Session
from src.database import get_db_session


class JWTBearer(HTTPBearer):
    """
    JWT Bearer token authentication middleware.
    """
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> Optional[str]:
        """
        Validate JWT token from request.

        Args:
            request: FastAPI request object

        Returns:
            str: The validated token if valid, None if invalid and auto_error is False

        Raises:
            HTTPException: If token is invalid and auto_error is True
        """
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)

        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid authentication scheme."
                )
            token = credentials.credentials
        else:
            # Try to get token from cookie as fallback
            token = request.cookies.get("access_token")
            if not token:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="No token provided."
                )

        # Verify the token
        payload = verify_token(token)
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid or expired token."
            )

        # Add user ID to request state for later use
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid token payload."
            )

        request.state.user_id = user_id
        return token


def verify_user_access(user_id: str, authenticated_user_id: str) -> bool:
    """
    Verify that the requested user ID matches the authenticated user ID.

    Args:
        user_id: The user ID from the request path/params
        authenticated_user_id: The user ID from the JWT token

    Returns:
        bool: True if the IDs match, False otherwise
    """
    return user_id == authenticated_user_id


def get_current_user_from_request(request: Request) -> str:
    """
    Get the authenticated user ID from the request state.

    Args:
        request: FastAPI request object

    Returns:
        str: The authenticated user ID
    """
    if hasattr(request.state, 'user_id'):
        return request.state.user_id
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )