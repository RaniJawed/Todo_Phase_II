from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .models import user, task  # Import models to register them with SQLModel
from .config import settings
import os
def create_app():
    app = FastAPI(
        title="Task Management API",
        description="API for managing tasks with user authentication",
        version="1.0.0"
    )
    # Get allowed origins from environment variable or use defaults
    # Support multiple origins separated by commas
    allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "https://full-stack-the-evolution-of-todo.vercel.app")
    allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]
    
    # Also add common Vercel patterns if not already included
    vercel_url = "https://full-stack-the-evolution-of-todo.vercel.app"
    if vercel_url and vercel_url not in allowed_origins:
        # Add both http and https versions
        if not vercel_url.startswith("http"):
            allowed_origins.append(f"https://{vercel_url}")
        else:
            allowed_origins.append(vercel_url)
    
    # Add CORS middleware
    # Note: When allow_credentials=True, you cannot use wildcard '*' for origins
    # Must specify exact origins
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    # Import and include routers
    from .routers import auth, tasks
    app.include_router(auth.router, prefix="/api", tags=["authentication"])
    app.include_router(tasks.router, prefix="/api", tags=["tasks"])
    from .routers import chat
    app.include_router(chat.router, prefix="/api", tags=["chat"])
    @app.get("/")
    def read_root():
        return {"message": "Task Management API"}
    @app.get("/health")
    def health_check():
        return {"status": "healthy"}
    
    @app.get("/debug/cookies")
    def debug_cookies(request: Request):
        """Debug endpoint to check if cookies are being received"""
        return {
            "cookies": dict(request.cookies),
            "headers": dict(request.headers),
            "origin": request.headers.get("origin"),
            "referer": request.headers.get("referer"),
        }
    return app
app = create_app()
# Create database tables on startup (for development)
@app.on_event("startup")
def on_startup():
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(bind=engine)