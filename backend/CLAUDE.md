# Claude Code Instructions: Backend - Task Management API

## Project Context

This is the backend component of "The Evolution of Todo" - Phase II, a full-stack web application for managing personal tasks with user authentication. Built with FastAPI, SQLModel, Python 3.13+, and PostgreSQL, following RESTful API design principles with automatic OpenAPI documentation.

## Project Constitution (MANDATORY - Read Carefully)

You MUST follow the constitutional requirements defined in the root `.specify/memory/constitution.md`:

### Core Principles (MANDATORY)
1. **Spec-Driven Development Only**: All features must be implemented from approved specifications in `specs/`
2. **AI as Primary Developer**: Humans write specs, Claude Code implements all code
3. **Mandatory Traceability**: Complete audit trail (ADR → Spec → Plan → Tasks → Implementation → Tests)
4. **Test-First Mandate**: Minimum 80% coverage target (pytest backend, Jest frontend, Playwright E2E)
5. **Evolutionary Consistency**: Phase II extends Phase I without breaking changes

### Phase II Backend Technology Stack Requirements (MANDATORY)

#### FastAPI Framework + SQLModel ORM (NOT raw SQLAlchemy)
- Python 3.13+ with UV package manager
- SQLModel ORM for type-safe database operations (NOT raw SQLAlchemy)
- Pydantic v2 for request/response validation and serialization
- Automatic OpenAPI/Swagger documentation generation
- Async/await patterns for non-blocking I/O
- Dependency injection for testability

#### Security Requirements (NON-NEGOTIABLE)
- User Data Isolation: ALL database queries MUST filter by user_id
- Authorization: verify user_id in URL matches authenticated user
- Return 404 (NOT 403) for unauthorized access attempts
- SQL injection prevention via SQLModel parameterized queries
- JWT validation on all protected endpoints
- Password hashing with bcrypt (NEVER plaintext passwords)

#### API Design Standards
- RESTful resource naming (`/api/tasks`, not `/api/getTasks`)
- Standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Consistent error response format (JSON with status, message, details)
- Proper HTTP status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error)
- Type-safe request/response schemas using Pydantic

## Current Feature Context

**Feature**: Task CRUD Operations with Authentication (001-task-crud-auth)
**Spec**: `../specs/001-task-crud-auth/spec.md`
**Plan**: `../specs/001-task-crud-auth/plan.md`
**Tasks**: `../specs/001-task-crud-auth/tasks.md`

### User Stories (Priority Order):
1. **US1 (P1)**: User Registration - New users can create accounts
2. **US2 (P1)**: User Login - Registered users can authenticate
3. **US3 (P2)**: View All My Tasks - Display user's tasks with data isolation
4. **US4 (P2)**: Create New Task - Add tasks with title/description
5. **US5 (P3)**: Mark Task Complete/Incomplete - Toggle completion status
6. **US6 (P3)**: Update Task - Edit task title/description
7. **US7 (P4)**: Delete Task - Remove tasks permanently

### Key Entities
- **User**: id (UUID), email (unique, indexed), password_hash (bcrypt), account timestamps
- **Task**: id (int), user_id (FK, indexed), title (1-200 chars), description (0-1000 chars), completed (bool, indexed), task timestamps

## Implementation Guidelines

### Database Layer (SQLModel)
- Use SQLModel models with proper relationships and constraints
- Add indexes on critical fields (user_id for performance, completed for filtering)
- Implement proper foreign key relationships
- Use automatic timestamp fields (created_at, updated_at)
- Follow SQLModel best practices for type safety

### Authentication Layer
- Implement JWT-based authentication with 7-day expiration
- Store secrets in environment variables (BETTER_AUTH_SECRET)
- Validate JWT tokens on all protected endpoints
- Return httpOnly cookies for secure token storage
- Hash passwords with bcrypt before storing

### Authorization Layer (CRITICAL - Security)
- ALL database queries must filter by user_id (100% data isolation)
- Verify user_id in URL paths matches authenticated user (return 404 if mismatch)
- Use dependency injection for authentication (get_current_user)
- Return 404 (not 403) for unauthorized access to prevent information leakage
- Implement proper role-based access if needed (though user isolation is primary)

### API Design
- Use FastAPI routers for endpoint organization
- Implement proper request/response validation with Pydantic schemas
- Follow RESTful conventions for resource naming and HTTP methods
- Include comprehensive API documentation via FastAPI auto-generation
- Handle errors consistently with proper HTTP status codes

### Error Handling
- Use HTTPException for API errors with appropriate status codes
- Implement custom exception handlers for consistent error responses
- Log errors for debugging while protecting sensitive information from users
- Provide user-friendly error messages without exposing system details

## Quality Standards

### Code Quality
- Clean, readable, well-documented code
- Follow Python PEP 8 standards
- Use type hints for all public interfaces
- Implement separation of concerns (models, schemas, routers, middleware, utils)
- No circular dependencies between modules

### Security
- Parameterized queries via SQLModel to prevent SQL injection
- Input validation and sanitization to prevent XSS
- Proper authentication and authorization on all endpoints
- Secure password handling with bcrypt
- Environment variable configuration for secrets

### Performance
- Proper indexing on database queries (especially user_id)
- Efficient database queries with proper joins when needed
- Async/await patterns for non-blocking operations
- Connection pooling for database operations

### Testing Requirements
- Unit tests for models and utility functions
- API integration tests for all endpoints
- Authentication and authorization tests (especially user isolation)
- Database transaction tests
- Error handling tests

### Documentation
- Type hints for all public interfaces
- Docstrings for complex functions
- API documentation via FastAPI auto-generation
- Inline comments for complex business logic only

## File Structure

```
backend/
├── src/
│   ├── main.py                    # FastAPI app entry point and configuration
│   ├── config.py                  # Configuration management (env vars, settings)
│   ├── database.py                # Database connection and session management
│   ├── models/                    # SQLModel database models
│   │   ├── __init__.py
│   │   ├── user.py                # User model with authentication fields
│   │   └── task.py                # Task model with user relationship
│   ├── schemas/                   # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── auth.py                # Auth request/response schemas
│   │   └── task.py                # Task request/response schemas
│   ├── routers/                   # API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py                # Authentication endpoints (register, login)
│   │   └── tasks.py               # Task CRUD endpoints
│   ├── middleware/                # FastAPI middleware
│   │   ├── __init__.py
│   │   └── auth.py                # JWT validation middleware
│   └── utils/                     # Utility functions
│       ├── __init__.py
│       ├── security.py            # Password hashing, JWT utilities
│       └── deps.py                # Dependency injection functions
├── tests/                         # Backend tests
│   ├── conftest.py                # pytest fixtures (test database, client)
│   ├── unit/                      # Unit tests
│   │   ├── test_models.py         # Model validation tests
│   │   └── test_security.py       # Security utility tests
│   └── integration/               # API integration tests
│       ├── test_auth.py           # Authentication flow tests
│       ├── test_tasks.py          # Task CRUD operation tests
│       └── test_user_isolation.py # User data isolation tests (CRITICAL)
├── alembic/                       # Database migrations
│   ├── versions/                  # Migration files
│   ├── env.py                     # Alembic environment
│   └── alembic.ini                # Alembic configuration
├── .env                           # Backend environment variables
├── pyproject.toml                 # UV project configuration
├── uv.lock                        # UV lock file
└── CLAUDE.md                      # Backend-specific agent instructions
```

## Working with Claude Code

1. **Follow Specifications**: Implement exactly what's in the spec, nothing more/less
2. **Maintain Security**: Never compromise user data isolation requirements
3. **Keep User Focus**: Remember this is for individual task management
4. **Test Thoroughly**: Implement tests for all acceptance scenarios, especially security
5. **Stay Organized**: Follow the defined project structure

## Success Metrics

- API endpoints respond in under 200ms (p95)
- 100% user data isolation (no cross-user data access)
- 95%+ of API requests succeed
- 80%+ test coverage across all layers
- Proper error handling with appropriate HTTP status codes