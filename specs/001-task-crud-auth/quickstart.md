# Quickstart Guide: Task CRUD Operations with Authentication

**Feature**: Task CRUD Operations with Authentication (001-task-crud-auth)
**Date**: 2025-12-18

## Overview

This guide provides instructions for setting up and running the task management application with user authentication. The application follows the Phase II architecture with a Next.js frontend and FastAPI backend.

## Prerequisites

- Docker 24+ and Docker Compose 2.x
- Node.js 18+ (for local development without Docker)
- Python 3.13+ (for local development without Docker)
- UV package manager (Python)

## Local Development Setup

### Option 1: Docker Compose (Recommended)

1. **Clone and navigate to project**
   ```bash
   git clone <repository-url>
   cd <project-root>
   ```

2. **Start the development environment**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Backend docs: http://localhost:8000/docs

### Option 2: Local Development

#### Backend Setup
1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies with UV**
   ```bash
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv pip install -r pyproject.toml
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

5. **Start the backend server**
   ```bash
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/todoapp
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

## Database Setup

The application uses PostgreSQL with SQLModel and Alembic for migrations:

1. **Initial setup**:
   ```bash
   alembic revision --autogenerate -m "Initial migration"
   alembic upgrade head
   ```

2. **Creating new migrations**:
   ```bash
   alembic revision --autogenerate -m "Description of changes"
   ```

## Running Tests

### Backend Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_auth.py
```

### Frontend Tests
```bash
# Run component tests
npm run test

# Run E2E tests
npm run e2e
```

## API Documentation

- Backend API docs: http://localhost:8000/docs (Swagger UI)
- Backend ReDoc: http://localhost:8000/redoc
- Contract files: `specs/001-task-crud-auth/contracts/`

## Key Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `PATCH /api/tasks/{id}` - Toggle task completion
- `DELETE /api/tasks/{id}` - Delete a task

## Development Workflow

1. **Feature development**:
   - Create feature branch: `git checkout -b feature/your-feature`
   - Implement changes
   - Write/update tests
   - Run tests: `npm run test` and `pytest`
   - Commit changes with conventional commits
   - Create pull request

2. **Database changes**:
   - Update SQLModel models in `backend/src/models/`
   - Generate migration: `alembic revision --autogenerate -m "Description"`
   - Review and run migration: `alembic upgrade head`

3. **API contract changes**:
   - Update OpenAPI specs in `specs/001-task-crud-auth/contracts/`
   - Update backend implementation to match contract
   - Update frontend API client if needed

## Troubleshooting

### Common Issues

**Docker container won't start**:
- Check that Docker is running
- Ensure ports 3000 and 8000 are available
- Check logs: `docker-compose logs`

**Database connection errors**:
- Verify PostgreSQL is running
- Check DATABASE_URL in backend .env
- Run migrations: `alembic upgrade head`

**Authentication not working**:
- Verify BETTER_AUTH_SECRET matches between frontend and backend
- Check JWT configuration
- Ensure httpOnly cookies are enabled in browser

## Performance Tips

- Use hot reloading during development (enabled by default)
- Implement proper database indexing on user_id and completed fields
- Use server components for non-interactive content in Next.js
- Implement proper caching strategies as needed