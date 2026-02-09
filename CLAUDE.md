# Claude Code Instructions: The Evolution of Todo - Phase II

## Project Context

This is Phase II of "The Evolution of Todo" - a full-stack web application for managing personal tasks with user authentication, supporting complete CRUD operations with strict user data isolation. The application consists of a Next.js 16+ frontend (App Router), FastAPI backend, and PostgreSQL database (local Docker + production Neon).

## Project Constitution (MANDATORY - Read Carefully)

You MUST follow the constitutional requirements defined in `.specify/memory/constitution.md`:

### Core Principles (MANDATORY)
1. **Spec-Driven Development Only**: All features must be implemented from approved specifications in `specs/`
2. **AI as Primary Developer**: Humans write specs, Claude Code implements all code
3. **Mandatory Traceability**: Complete audit trail (ADR → Spec → Plan → Tasks → Implementation → Tests)
4. **Test-First Mandate**: Minimum 80% coverage target (pytest backend, Jest frontend, Playwright E2E)
5. **Evolutionary Consistency**: Phase II extends Phase I without breaking changes

### Phase II Technology Stack Requirements (MANDATORY)

#### Frontend (Next.js 16+ App Router - NOT Pages Router)
- Server Components by default, Client Components ONLY for interactivity
- Client Components MUST have `'use client'` directive at top of file
- TypeScript strict mode
- Tailwind CSS for all styling (NO inline styles, NO CSS modules)
- Better Auth with JWT plugin for authentication

#### Backend (FastAPI + SQLModel - NOT raw SQLAlchemy)
- Python 3.13+ with UV package manager
- SQLModel ORM for type-safe database operations
- Pydantic v2 for validation
- JWT authentication middleware on protected endpoints

#### Security Requirements (NON-NEGOTIABLE)
- User Data Isolation: ALL database queries MUST filter by user_id
- Authorization: verify user_id in URL matches authenticated user
- Return 404 (NOT 403) for unauthorized access attempts
- SQL injection prevention via SQLModel parameterized queries

### Repository Structure (MANDATORY)
```
/
├── frontend/                    # Next.js 16+ application
│   ├── app/                     # App Router (NOT Pages Router)
│   ├── components/              # React components
│   ├── lib/                     # Utilities, API client
│   └── tests/                   # Component, integration, E2E tests
├── backend/                     # FastAPI application
│   ├── src/
│   │   ├── main.py              # Entry point
│   │   ├── models/              # SQLModel definitions
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── routers/             # API routes
│   │   └── middleware/          # Authentication, etc.
│   ├── tests/                   # API integration, unit tests
│   └── alembic/                 # Database migrations
├── specs/001-task-crud-auth/    # Feature specifications
├── docker-compose.yml           # Local development orchestration
└── README.md                    # Project overview
```

## Current Feature Context

**Feature**: Task CRUD Operations with Authentication (001-task-crud-auth)
**Spec**: `specs/001-task-crud-auth/spec.md`
**Plan**: `specs/001-task-crud-auth/plan.md`
**Tasks**: `specs/001-task-crud-auth/tasks.md`

### User Stories (Priority Order):
1. **US1 (P1)**: User Registration - New users can create accounts
2. **US2 (P1)**: User Login - Registered users can authenticate
3. **US3 (P2)**: View All My Tasks - Display user's tasks with data isolation
4. **US4 (P2)**: Create New Task - Add tasks with title/description
5. **US5 (P3)**: Mark Task Complete/Incomplete - Toggle completion status
6. **US6 (P3)**: Update Task - Edit task title/description
7. **US7 (P4)**: Delete Task - Remove tasks permanently

### Key Entities
- **User**: id (UUID), email (unique), password_hash (bcrypt), timestamps
- **Task**: id (int), user_id (FK), title (1-200 chars), description (0-1000 chars), completed (bool), timestamps

### Critical Security Requirements
- ALL database queries must filter by `user_id` for data isolation
- Authorization checks must verify `user_id` in URL matches authenticated user
- Return 404 (not 403) for unauthorized access to prevent information leakage
- Use parameterized queries to prevent SQL injection
- Sanitize user input to prevent XSS

## Implementation Guidelines

### Frontend Implementation
- Use Server Components by default, Client Components only for interactivity (forms, clicks, state)
- Follow Next.js App Router conventions (app/ directory structure)
- Use Tailwind CSS utility classes exclusively (no inline styles)
- Implement proper error boundaries and loading states
- Create type-safe API client for backend communication

### Backend Implementation
- Use FastAPI dependency injection for database sessions and authentication
- Implement JWT validation middleware for protected endpoints
- Use SQLModel for all database operations (no raw SQL)
- Follow RESTful API design principles
- Return consistent error responses

### Database Implementation
- Use SQLModel models with proper relationships
- Add indexes on `user_id` (critical for performance) and `completed` fields
- Implement proper foreign key constraints
- Automatically set `created_at` and `updated_at` timestamps

## Quality Standards

### Code Quality
- Clean, readable, self-documenting code
- Consistent naming conventions
- Cyclomatic complexity < 10 per function
- No code duplication (DRY principle)
- Proper error handling for all failure modes

### Testing Requirements
- Unit tests for complex business logic
- API integration tests for all endpoints
- Component tests for UI interactions
- E2E tests for critical user journeys
- User isolation tests (SECURITY CRITICAL)

### Documentation
- Inline comments for complex logic only
- API documentation via FastAPI auto-generation
- TypeScript interfaces for type safety

## Working with Claude Code

1. **Follow Specifications**: Implement exactly what's in the spec, nothing more/less
2. **Maintain Security**: Never compromise user data isolation requirements
3. **Keep User Focus**: Remember this is for individual task management
4. **Test Thoroughly**: Implement tests for all acceptance scenarios
5. **Stay Organized**: Follow the defined project structure

## Success Metrics

- Users can register and log in within 10 seconds
- Task operations complete in under 2 seconds
- 100% user data isolation (no cross-user data access)
- 95%+ success rate on user actions
- <200ms API response times
- Minimum 80% test coverage