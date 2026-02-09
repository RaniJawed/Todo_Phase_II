from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from typing import Any
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.schemas.auth import RegisterRequest, RegisterResponse, LoginRequest, LoginResponse
from src.models.user import User
from src.utils.security import get_password_hash, verify_password, create_access_token, verify_token
from src.utils.deps import get_db
router = APIRouter(tags=["Authentication"])

@router.post("/register", response_model=RegisterResponse)
def register(user_data: RegisterRequest, db: Session = Depends(get_db)) -> RegisterResponse:
    """
    Register a new user with email and password.
    Args:
        user_data: Registration request containing email and password
        db: Database session dependency
    Returns:
        RegisterResponse: Created user information
    Raises:
        HTTPException: If email is invalid format (handled by Pydantic) or email already exists
    """
    # Check if user with this email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists"
        )
    # Validate password length (minimum 8 characters)
    if len(user_data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters"
        )
    # Create password hash (password truncation to 72 bytes is handled in get_password_hash)
    password_hash = get_password_hash(user_data.password)
    # Create new user
    user = User(
        email=user_data.email,
        password_hash=password_hash
    )
    # Add user to database
    db.add(user)
    db.commit()
    db.refresh(user)
    # Return response
    return RegisterResponse(
        id=str(user.id),
        email=user.email,
        created_at=user.created_at
    )

@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, request: Request, response: Response, db: Session = Depends(get_db)) -> LoginResponse:
    """
    Authenticate user and return JWT token.
    Args:
        login_data: Login request containing email and password
        response: FastAPI response object to set cookies
        db: Database session dependency
    Returns:
        LoginResponse: JWT token and user information
    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by email
    user = db.query(User).filter(User.email == login_data.email).first()
    # Check if user exists and password is correct (password truncation to 72 bytes is handled in verify_password)
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    # Set the token in an httpOnly cookie for security
    # For cross-domain (Vercel frontend + HuggingFace backend), use samesite="none" and secure=True
    import os
    # Detect if we're in production (HTTPS) or development (HTTP)
    # HuggingFace Spaces always uses HTTPS, so we need cross-domain cookies
    is_production = (
        os.getenv("ENVIRONMENT", "").lower() == "production" or
        os.getenv("SPACE_ID") is not None or  # HuggingFace Spaces set this
        "hf.space" in os.getenv("SPACE_HOST", "") or  # HuggingFace Spaces host
        request.url.scheme == "https"  # If request is HTTPS, we're in production
    )
    
    # Always use secure=True and samesite="none" for cross-domain cookies in production
    # This is required for Vercel (frontend) + HuggingFace (backend) setup
    cookie_kwargs = {
        "key": "access_token",
        "value": access_token,
        "httponly": True,
        "secure": True,  # Always True - required for HTTPS and cross-domain cookies
        "max_age": 604800,  # 7 days in seconds
        "path": "/",  # Ensure cookie is available for all paths
    }
    
    # For cross-domain cookies, we MUST use samesite="none" with secure=True
    if is_production:
        cookie_kwargs["samesite"] = "none"
    else:
        cookie_kwargs["samesite"] = "lax"
    
    response.set_cookie(**cookie_kwargs)
    
    # Debug logging (remove in production if needed)
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Cookie set: access_token (production={is_production}, samesite={cookie_kwargs.get('samesite')})")
    # Return response
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=str(user.id),
        email=user.email
    )

@router.get("/me")
def get_current_user(request: Request, db: Session = Depends(get_db)):
    """
    This endpoint is used to check if a user is authenticated and get their info.
    """
    # Debug: Log all cookies received
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Cookies received: {list(request.cookies.keys())}")
    logger.info(f"Headers: {dict(request.headers)}")
    
    # Get the token from cookies
    token = request.cookies.get("access_token")
    
    if not token:
        # Also try Authorization header as fallback
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            logger.info("Token found in Authorization header")
        else:
            logger.warning("No access_token cookie found and no Authorization header")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated - no token found in cookies or headers",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    # Verify the token
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user ID from token
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {
        "user_id": str(user.id),
        "email": user.email
    }