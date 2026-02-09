# The Evolution of Todo - Task Management Application!

A full-stack web application for managing personal tasks with user authentication, supporting create, read, update, delete operations with user data isolation.

## Overview

This application demonstrates the evolution of a simple CLI todo application into a cloud-native, AI-powered, event-driven distributed system. This Phase II implementation features:

- Full-stack web application with Next.js 16+ frontend and FastAPI backend
- User authentication with JWT tokens
- Complete CRUD operations for tasks
- User data isolation (each user sees only their own tasks)
- Modern tech stack with TypeScript, Tailwind CSS, PostgreSQL

## Tech Stack

- **Frontend**: Next.js 16+ (App Router), React 19+, TypeScript 5.x, Tailwind CSS
- **Backend**: FastAPI 0.115+, Python 3.13+, SQLModel ORM, Pydantic v2
- **Database**: PostgreSQL 16 (local Docker + production Neon)
- **Authentication**: Better Auth with JWT plugin
- **Development**: Docker Compose, UV package manager

## Prerequisites

- Docker 24+
- Docker Compose 2.x
- Node.js 18+ (for local development without Docker)

## Quick Start

### With Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Start the development environment:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Backend Docs: http://localhost:8000/docs

### Local Development

#### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies with UV:
   ```bash
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv pip install -e .
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run database migrations:
   ```bash
   alembic upgrade head
   ```

5. Start the backend server:
   ```bash
   uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Features

### User Authentication
- User registration with email and password
- Secure login with JWT tokens
- Session management with 7-day expiration
- Password hashing with bcrypt

### Task Management
- Create tasks with title and optional description
- View all your tasks with sorting and filtering
- Update task details
- Mark tasks as complete/incomplete
- Delete tasks permanently

### Security
- User data isolation (100% query filtering by user_id)
- JWT validation on all protected endpoints
- Input validation and sanitization
- Protection against SQL injection and XSS

## API Documentation

Backend API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/todoapp
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

### Testing the Full User Flow

To test the complete user flow (register → login → create task → view → toggle → edit → delete):

```bash
# Start the full application with Docker Compose
docker-compose up --build

# Then navigate to http://localhost:3000 and follow the user flow:
# 1. Register a new account
# 2. Login with your credentials
# 3. Create a new task
# 4. View your tasks
# 5. Toggle task completion status
# 6. Edit task details
# 7. Delete a task
```

For detailed testing instructions, see [TESTING_INSTRUCTIONS.md](TESTING_INSTRUCTIONS.md).

#### Backend Tests
```bash
# Run all tests
cd backend && pytest

# Run with coverage
pytest --cov=src --cov-report=html
```

#### Frontend Tests
```bash
# Run component tests
cd frontend && npm run test

# Run E2E tests
cd frontend && npm run e2e
```

## Architecture

This application follows the Phase II architecture requirements:
- Monorepo structure with separate frontend/ and backend/ directories
- Next.js App Router for server/client component separation
- FastAPI with SQLModel ORM for type-safe database operations
- JWT-based authentication with proper authorization
- Complete user data isolation with user_id filtering

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test` and `pytest`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is part of the "The Evolution of Todo" educational series.
"# Todo_Phase_II" 
