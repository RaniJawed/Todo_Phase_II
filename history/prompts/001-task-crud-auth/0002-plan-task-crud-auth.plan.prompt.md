---
id: 0002
title: plan-task-crud-auth
stage: plan
date: 2025-12-18
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-task-crud-auth
branch: 001-task-crud-auth
command: /sp.plan
labels: ["planning", "architecture", "authentication", "crud", "tasks"]
links:
  spec: specs/001-task-crud-auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - "specs/001-task-crud-auth/plan.md"
  - "specs/001-task-crud-auth/research.md"
  - "specs/001-task-crud-auth/data-model.md"
  - "specs/001-task-crud-auth/quickstart.md"
  - "specs/001-task-crud-auth/contracts/auth.openapi.yaml"
  - "specs/001-task-crud-auth/contracts/tasks.openapi.yaml"
  - "specs/001-task-crud-auth/contracts/README.md"
  - "CLAUDE.md"
tests:
  - "No tests needed for planning phase"
---

## Prompt

```
# Implementation Plan: Task CRUD Operations with Authentication

**Branch**: `001-task-crud-auth` | **Date**: 2025-12-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-task-crud-auth/spec.md`

## Summary

Build a full-stack web application for task management with user authentication, supporting complete CRUD operations with strict user data isolation. The application will consist of a Next.js 16+ frontend (App Router), FastAPI backend, and PostgreSQL database (local Docker + production Neon). Users can register, authenticate via JWT tokens, and manage their personal tasks (create, read, update, delete, toggle completion status). All operations enforce user data isolation through user_id filtering, with proper authorization checks returning 404 for unauthorized access attempts.

**Technical Approach**: Monorepo structure with separate frontend/ and backend/ directories, Docker Compose for local development orchestration, Better Auth + JWT for authentication flow, SQLModel ORM for type-safe database operations, and RESTful API design following OpenAPI specification.

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5.x with Next.js 16+
- Backend: Python 3.13+ with UV package manager

**Primary Dependencies**:
- Frontend: Next.js 16+ (App Router), React 19+, Better Auth (JWT plugin), Tailwind CSS 4.x, TypeScript 5.x
- Backend: FastAPI 0.115+, SQLModel 0.0.24+, Pydantic v2, python-jose (JWT), bcrypt, psycopg2-binary, Alembic (migrations)
- Database: PostgreSQL 16
- Development: Docker 24+, Docker Compose 2.x

**Storage**: PostgreSQL 16 (local Docker container for development, Neon Serverless PostgreSQL for production)

**Testing**:
- Frontend: Jest + React Testing Library (component tests), Playwright (E2E tests)
- Backend: pytest + pytest-asyncio (API integration tests, unit tests)
- Coverage Target: Minimum 80% for both frontend and backend

**Target Platform**:
- Frontend: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 years)
- Backend: Linux container (Docker-based deployment)
- Development: Cross-platform (Windows/macOS/Linux with Docker)

**Project Type**: Web application (monorepo with frontend and backend)

**Performance Goals**:
- API Response Time: <200ms (p95) under normal load
- Page Load Time: <2s for initial dashboard load
- Hot Reload: <3s for code changes during development
- Database Queries: Optimized with indexes on user_id, completed fields
- Concurrent Users: Support 100+ simultaneous users without degradation

**Constraints**:
- Security: User data isolation (100% query filtering by user_id), JWT validation on all protected endpoints, 404 (not 403) for unauthorized access
- Development: Single-command startup (docker-compose up), hot reload for rapid iteration
- Database: Same schema works in Docker PostgreSQL and Neon (connection string only)
- Authentication: 7-day JWT token expiration, httpOnly cookie storage
- Validation: Title 1-200 chars, description max 1000 chars, email format validation
- Error Handling: User-friendly messages, proper HTTP status codes

**Scale/Scope**:
- Expected Users: 100-1000 concurrent users
- Data Volume: 0-1000 tasks per user (pagination deferred to Phase III)
- Deployment: Single region, horizontal scaling via container orchestration
- MVP Scope: 7 user stories (registration, login, view, create, update, delete, toggle tasks)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Spec-Driven Development Only ✅ PASS
- [x] Complete specification exists: `specs/001-task-crud-auth/spec.md`
- [x] 7 prioritized user stories with acceptance criteria defined
- [x] 43 functional requirements documented
- [x] 14 measurable success criteria established
- [x] No implementation before spec approval

**Status**: PASS - Specification complete and approved

### Test-First Mandate ✅ PASS
- [x] Test types defined: API integration, component, E2E, auth flow, user isolation
- [x] Minimum 80% coverage target set
- [x] Test framework specified: pytest (backend), Jest (frontend), Playwright (E2E)
- [x] Tests will be written before/during implementation (Phase III red-green-refactor)

**Status**: PASS - Test strategy aligned with Phase II requirements

### Phase II Technology Stack Compliance ✅ PASS

**Frontend Requirements**:
- [x] Next.js 16+ with App Router (NOT Pages Router) - CONFIRMED
- [x] TypeScript strict mode - CONFIRMED
- [x] Tailwind CSS (no inline styles, no CSS modules) - CONFIRMED
- [x] Better Auth with JWT plugin - CONFIRMED
- [x] Server Components by default, Client Components only for interactivity - CONFIRMED

**Backend Requirements**:
- [x] FastAPI framework - CONFIRMED
- [x] SQLModel ORM (NOT raw SQLAlchemy) - CONFIRMED
- [x] Python 3.13+ - CONFIRMED
- [x] UV package manager - CONFIRMED
- [x] Pydantic v2 for validation - CONFIRMED
- [x] JWT authentication middleware - CONFIRMED

**Database Requirements**:
- [x] PostgreSQL 16 - CONFIRMED
- [x] SQLModel models with relationships - CONFIRMED
- [x] Indexed foreign keys (user_id) - CONFIRMED
- [x] Timestamps (created_at, updated_at) on all tables - CONFIRMED

**Security Requirements (NON-NEGOTIABLE)**:
- [x] User Data Isolation: ALL queries filter by user_id - PLANNED
- [x] Authorization: verify user_id matches authenticated user - PLANNED
- [x] JWT validation on all protected endpoints - PLANNED
- [x] Return 404 (not 403) for unauthorized access - PLANNED
- [x] SQL injection prevention via SQLModel parameterized queries - CONFIRMED

**API-First Principles**:
- [x] API contracts defined before implementation - PLANNED (Phase 1)
- [x] Backend implements API first - PLANNED (implementation order)
- [x] Frontend consumes via type-safe client - PLANNED
- [x] OpenAPI/Swagger auto-generated - CONFIRMED (FastAPI built-in)

**Status**: PASS - All Phase II technology requirements met

### Repository Structure Compliance ✅ PASS
- [x] Monorepo structure with frontend/ and backend/ directories - PLANNED
- [x] Separate CLAUDE.md files at root and workspace levels - TO BE CREATED
- [x] Specs in specs/001-task-crud-auth/ - CONFIRMED
- [x] Docker Compose for local development - PLANNED
- [x] Environment variables via .env files - PLANNED

**Status**: PASS - Structure aligns with Phase II mandatory layout

### Evolutionary Consistency ✅ PASS
- [x] Domain model extends Phase I (id, title, description, completed) - CONFIRMED
- [x] Additive changes only (user_id, timestamps added) - CONFIRMED
- [x] No breaking changes to Phase I base model - CONFIRMED
- [x] Phase I semantics preserved ("create task", "mark complete" same meaning) - CONFIRMED

**Status**: PASS - Phase II extends Phase I without breaking changes

### Final Gate Decision: ✅ PROCEED TO RESEARCH

All constitutional requirements met. No violations require justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-task-crud-auth/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file (/sp.plan output)
├── research.md          # Phase 0: Technology research and decisions
├── data-model.md        # Phase 1: Database schema and entities
├── quickstart.md        # Phase 1: Development setup guide
├── contracts/           # Phase 1: API contracts (OpenAPI)
│   ├── auth.openapi.yaml
│   ├── tasks.openapi.yaml
│   └── README.md
└── tasks.md             # Phase 2: Implementation tasks (/sp.tasks output - future)
```

### Source Code (repository root)

```text
/
├── .specify/
│   ├── memory/
│   │   └── constitution.md
│   ├── templates/
│   └── scripts/
├── history/
│   ├── adr/
│   └── prompts/
├── specs/
│   └── 001-task-crud-auth/
├── frontend/                         # Next.js 16+ Application
│   ├── app/                          # App Router (NOT Pages Router)
│   │   ├── layout.tsx               # Root layout (Server Component)
│   │   ├── page.tsx                 # Home/dashboard page
│   │   ├── register/
│   │   │   └── page.tsx             # Registration page
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   └── tasks/
│   │       ├── page.tsx             # Task list page (Server Component)
│   │       ├── [id]/
│   │       │   └── page.tsx         # Task detail/edit page
│   │       └── new/
│   │           └── page.tsx         # Create task page
│   ├── components/
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── TaskList.tsx             # Client Component (interactive)
│   │   ├── TaskItem.tsx             # Client Component (toggle, delete)
│   │   ├── TaskForm.tsx             # Client Component (forms)
│   │   └── EmptyState.tsx           # Server Component
│   ├── lib/
│   │   ├── api.ts                   # Type-safe API client
│   │   ├── auth.ts                  # Better Auth configuration
│   │   └── types.ts                 # TypeScript interfaces
│   ├── public/
│   ├── tests/
│   │   ├── components/              # Component tests (Jest)
│   │   ├── integration/             # Integration tests
│   │   └── e2e/                     # Playwright E2E tests
│   ├── .env.local                   # Frontend environment variables
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── CLAUDE.md                    # Frontend-specific agent instructions
│   └── Dockerfile.dev               # Development container
├── backend/                          # FastAPI Application
│   ├── src/
│   │   ├── main.py                  # FastAPI entry point, app initialization
│   │   ├── config.py                # Configuration management (env vars)
│   │   ├── database.py              # Database connection, session management
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py              # User SQLModel (id, email, password_hash, timestamps)
│   │   │   └── task.py              # Task SQLModel (id, user_id FK, title, description, completed, timestamps)
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # AuthRequest, AuthResponse, RegisterRequest
│   │   │   └── task.py              # TaskCreate, TaskUpdate, TaskResponse, TaskList
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # POST /api/auth/register, POST /api/auth/login
│   │   │   └── tasks.py             # CRUD endpoints for tasks
│   │   ├── middleware/
│   │   │   ├── __init__.py
│   │   │   └── auth.py              # JWT validation middleware
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── security.py          # bcrypt hashing, JWT creation/validation
│   │       └── deps.py              # Dependency injection (get_db, get_current_user)
│   ├── tests/
│   │   ├── conftest.py              # pytest fixtures (test database, client)
│   │   ├── unit/
│   │   │   ├── test_models.py
│   │   │   └── test_security.py
│   │   └── integration/
│   │       ├── test_auth.py         # Test registration, login, JWT flow
│   │       ├── test_tasks.py        # Test task CRUD operations
│   │       └── test_user_isolation.py  # Test user data isolation (CRITICAL)
│   ├── alembic/                     # Database migrations
│   │   ├── versions/
│   │   ├── env.py
│   │   └── alembic.ini
│   ├── .env                         # Backend environment variables
│   ├── pyproject.toml               # UV project configuration
│   ├── uv.lock                      # UV lock file
│   ├── CLAUDE.md                    # Backend-specific agent instructions
│   └── Dockerfile.dev               # Development container
├── docker-compose.yml                # Local development orchestration
├── .gitignore
├── README.md                         # Project overview and setup
└── CLAUDE.md                         # Root AI agent instructions
```

**Structure Decision**: Web application monorepo with frontend/ and backend/ separation, following Phase II constitutional requirements. This structure:
- Isolates frontend and backend concerns for independent development/deployment
- Enables workspace-specific CLAUDE.md agent instructions
- Supports Docker Compose orchestration of services
- Aligns with Next.js App Router conventions (app/ directory)
- Follows FastAPI best practices (routers, models, schemas separation)
- Maintains shared specifications in top-level specs/ directory

## Complexity Tracking

> No violations detected - all architectural decisions align with constitution requirements.

*Empty - No constitutional violations require justification.*
```

## Response snapshot

Successfully completed the planning phase for the Task CRUD Operations with Authentication feature. The implementation plan includes:

1. **Completed Implementation Plan** (`plan.md`): Comprehensive architecture plan with technical context, constitutional compliance checks, and project structure

2. **Research Document** (`research.md`): Technology decisions and best practices for Next.js 16+, FastAPI, PostgreSQL, authentication, and security

3. **Data Model** (`data-model.md`): Complete SQLModel definitions for User and Task entities with relationships, constraints, and indexing strategy

4. **API Contracts** (`contracts/`):
   - `auth.openapi.yaml`: Authentication endpoints (register, login, logout)
   - `tasks.openapi.yaml`: Task CRUD operations with proper security and validation
   - `README.md`: API contracts documentation

5. **Quickstart Guide** (`quickstart.md`): Complete setup instructions for Docker Compose and local development, environment variables, testing, and troubleshooting

6. **Agent Context Update**: Updated `CLAUDE.md` with PostgreSQL 16 technology information

All constitutional requirements were verified and confirmed as met. The plan follows Phase II requirements with Next.js App Router, FastAPI, SQLModel ORM, JWT authentication, and proper user data isolation. The API contracts implement proper security with user_id filtering, 404 responses for unauthorized access, and comprehensive validation.

## Outcome

- ✅ Impact: Complete architecture plan ready for task breakdown and implementation
- 🧪 Tests: Test strategy defined with 80% coverage target across frontend/backend/E2E
- 📁 Files: Created 8 files across documentation, contracts, and configuration
- 🔁 Next prompts: Ready for `/sp.tasks` to generate implementation tasks
- 🧠 Reflection: Plan follows SDD principles with constitutional compliance, API-first design, and security-first approach

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All constitutional compliance checks passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Run `/sp.tasks` to generate implementation tasks
