---
id: 0001
title: update-constitution
stage: constitution
date: 2025-12-18
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: nirma_qureshi
command: /sp.constitution
labels: ["constitution", "project-setup", "governance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - ".specify/memory/constitution.md"
tests:
  - "No tests needed for constitution update"
---

## Prompt

```
# The Evolution of Todo - Project Constitution

## Preamble

This Constitution establishes the governing principles, standards, and invariants for **"The Evolution of Todo"** — a multi-phase educational software project demonstrating the evolution of a simple CLI todo application into a cloud-native, AI-powered, event-driven distributed system.

**Core Purpose**: To teach students modern software engineering through Spec-Driven Development (SDD) and AI-assisted implementation, where humans act as architects and AI (Claude Code) performs all coding work.

**Scope of Authority**: This Constitution applies to ALL phases, ALL features, ALL specifications, ALL plans, ALL tasks, and ALL implementations across the entire project lifecycle.

**Supremacy Clause**: If any specification, plan, task, or implementation conflicts with this Constitution, **THE CONSTITUTION WINS**. The conflicting artifact must be rewritten or regenerated.

---

## I. Core Principles (NON-NEGOTIABLE)

### 1. Spec-Driven Development Only

**Mandate**: All feature development must follow the strict SDD workflow:

```
/sp.constitution → /sp.specify → /sp.plan → /sp.tasks → /sp.implement
```

**Rules**:
- No feature may be implemented without a complete, approved specification
- Humans may NOT manually write feature code
- If generated code is incorrect, refine the SPEC, not the code
- All specifications are versioned and stored in `specs/`
- Every spec must include clear acceptance criteria and test scenarios

**Violations**: Any manually-written feature code is considered non-compliant and must be regenerated through the SDD workflow.

### 2. AI as Primary Developer

**Division of Responsibilities**:

**Humans Must**:
- Write and refine feature specifications
- Review architectural decisions
- Run and validate tests
- Approve changes before merge
- Make final decisions on tradeoffs

**AI (Claude Code) Must**:
- Generate architecture plans from specs
- Write all implementation code
- Create comprehensive test suites
- Perform refactoring and bug fixes
- Document all generated artifacts

**Accountability**: All AI-generated code is traceable to the human-written specification that authorized it.

### 3. Mandatory Traceability

**Requirement**: Every feature must maintain a complete audit trail:

1. **Architecture Decision Record (ADR)** — Why this approach?
2. **Specification** — What are we building?
3. **Architecture Plan** — How will we build it?
4. **Task Breakdown** — What are the specific implementation steps?
5. **Implementation** — The generated code
6. **Test Suite** — Verification of correctness

**Linkage**: All artifacts must cross-reference each other. ADRs link to specs, specs link to plans, plans link to tasks, tasks link to implementations.

**Storage**:
- ADRs → `history/adr/`
- Specs → `specs/<feature>/spec.md`
- Plans → `specs/<feature>/plan.md`
- Tasks → `specs/<feature>/tasks.md`
- PHRs → `history/prompts/`
- Code → `src/` (Phase I) or `frontend/`, `backend/` (Phase II+)
- Tests → `tests/` (Phase I) or `frontend/tests/`, `backend/tests/` (Phase II+)

### 4. Test-First Mandate

**Requirement**: Testing is NOT optional.

**Rules**:
- Tests must be generated before or immediately after implementation
- Every feature must have integration tests covering user journeys
- Unit tests required for complex business logic
- All tests must pass before marking a feature complete
- Test coverage must be maintained across refactoring
- Minimum 80% code coverage target for Phase II+

**Test Types by Phase**:
- **Phase I (CLI)**: Integration tests for command flows, unit tests for core logic
- **Phase II (Web)**: API integration tests (contract testing), React component tests, E2E user journeys, authentication flow tests, user isolation tests (security critical)
- **Phase III+ (Distributed)**: Contract tests, integration tests, chaos testing

### 5. Evolutionary Consistency

**Principle**: Later phases extend but never break earlier phases.

**Rules**:
- Phase II must support all Phase I functionality
- Phase III must preserve Phase I and II semantics
- Breaking changes require explicit ADR and migration plan
- Domain model extensions are additive only

**Verification**: Regression test suites from earlier phases must continue to pass.

---

## II. Domain Model Governance

### Global Todo Domain Rules

**Base Model (Phase I - Immutable)**:
```
Todo:
  - id: unique identifier
  - title: short description
  - description: detailed text (optional)
  - completed: boolean status
```

**Phase II Extensions (Additive)**:
```
  - user_id: foreign key to users table (REQUIRED for multi-user support)
  - created_at: timestamp (ISO 8601 format)
  - updated_at: timestamp (ISO 8601 format)
```

**Intermediate Extensions (Phase II - Optional/Future)**:
```
  - priority: enum (low, medium, high)
  - tags: list of strings
  - category: single classification
```

**Advanced Extensions (Phase III+ - Additive)**:
```
  - due_date: optional deadline
  - recurrence: optional repeat pattern
  - reminders: list of reminder configs
  - assigned_to: user/agent reference
  - parent_id: for subtasks
```

**Invariants**:
- `id` is immutable once assigned
- `user_id` is immutable once assigned (Phase II+)
- `completed` is boolean; no intermediate states
- State transitions are explicit and logged
- All timestamps use ISO 8601 format
- All field additions must maintain backward compatibility

**Semantic Consistency**:
- "Creating a todo" has the same meaning in CLI, Web UI, API, and AI agent
- "Marking complete" follows identical rules across all interfaces
- Search/filter/sort behavior is consistent across all phases

---

## III. Technology Governance

### Python Backend Standards (Phase I)

**Requirements**:
- Python 3.13+ required (updated from 3.10+)
- Type hints for all public interfaces
- Modular, single-responsibility design
- Separation of concerns: domain logic ≠ infrastructure
- No global mutable state
- Dependency injection for testability

**Forbidden**:
- Mixing business logic with I/O operations
- Hardcoded configuration values
- Circular dependencies between modules
- Undocumented magic numbers or strings

### Phase II Technology Stack Requirements

#### Frontend (Next.js 16+)

**Mandatory Requirements**:
- MUST use App Router (NOT Pages Router)
- Server Components by default
- Client Components ONLY for interactivity (forms, onClick, useState, etc.)
- Client Components MUST have `'use client'` directive at top of file
- TypeScript strict mode enabled
- Tailwind CSS for all styling (no inline styles, no CSS modules)
- Better Auth with JWT plugin for authentication
- Type-safe API client for backend communication

**Forbidden**:
- Pages Router usage
- Direct database access from frontend
- Hardcoded API URLs (use environment variables)
- Inline styles or CSS modules
- Unvalidated user input

#### Backend (FastAPI + SQLModel)

**Mandatory Requirements**:
- Python 3.13+ required
- FastAPI framework for REST API
- SQLModel ORM (NOT raw SQLAlchemy)
- Pydantic v2 for request/validation
- UV package manager for dependency management
- Neon Serverless PostgreSQL database
- OpenAPI/Swagger documentation auto-generated
- JWT authentication middleware on protected endpoints

**Forbidden**:
- Raw SQLAlchemy usage (must use SQLModel)
- Hardcoded database credentials
- SQL string concatenation (use SQLModel parameterized queries)
- Synchronous blocking I/O (use async/await)

#### Authentication (CRITICAL - Phase II)

**Mandatory Requirements**:
- Better Auth on frontend with JWT plugin
- JWT tokens for backend authentication
- Shared secret (`BETTER_AUTH_SECRET`) between frontend and backend
- Token expiration: 7 days
- Password hashing with bcrypt (NEVER plaintext passwords)
- HTTP-only cookies for token storage (frontend)
- Authorization header with Bearer token (backend)

**Security Flow**:
1. User registers/logs in via Better Auth (frontend)
2. Better Auth generates JWT signed with `BETTER_AUTH_SECRET`
3. JWT sent to backend in Authorization header
4. Backend validates JWT using same `BETTER_AUTH_SECRET`
5. Backend extracts `user_id` from validated token
6. Backend uses `user_id` for authorization and data filtering

#### Phase II Security Requirements (NON-NEGOTIABLE)

**User Data Isolation**:
- ALL database queries MUST filter by `user_id`
- No user can access another user's data
- Every protected endpoint MUST verify JWT and extract `user_id`
- Use `user_id` from validated JWT, NEVER from request parameters

**Authorization Rules**:
- ALWAYS verify `user_id` in URL/path matches authenticated user
- Example: `GET /api/todos/{todo_id}` must verify todo belongs to authenticated user
- Return 404 (not 403) if user tries to access another user's data
- SQL injection prevention via SQLModel parameterized queries

**Forbidden**:
- Trusting `user_id` from request body/query parameters
- Exposing other users' data in error messages
- Using sequential/predictable IDs without authorization checks
- Bypassing JWT validation on "internal" endpoints

#### API-First Principles (Phase II)

**Mandatory Requirements**:
- API contracts MUST be defined before implementation
- Backend implements API contract first
- Frontend consumes contract via type-safe client
- OpenAPI/Swagger documentation auto-generated from FastAPI
- Contract breaking changes require ADR

**API Design Rules**:
- RESTful resource naming (`/api/todos`, not `/api/getTodos`)
- Standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Consistent error response format (JSON with status, message, details)
- Versioning strategy defined (URL-based: `/api/v1/todos`)
- Pagination for list endpoints (limit/offset or cursor-based)

### Next.js Frontend Standards (Phase II+)

**Requirements**:
- Clear separation: server components vs. client components
- Type-safe API contracts (TypeScript interfaces matching backend schemas)
- Responsive design (mobile-first)
- Accessibility (WCAG 2.1 AA minimum)
- Error boundaries for graceful degradation
- Loading states and optimistic UI updates

**Forbidden**:
- Direct database access from frontend
- Hardcoded API URLs
- Inline styles (use Tailwind utility classes)
- Unvalidated user input
- Mixing server and client component logic without clear boundaries

### AI Agent Standards (Phase III+)

**Requirements**:
- Natural language inputs must map to existing Todo operations
- Graceful handling of ambiguous commands
- Confirmation prompts for destructive actions
- All agent logic must be spec-driven
- Comprehensive intent recognition testing

**Forbidden**:
- Agents creating undocumented side effects
- Bypassing validation rules
- Silent failures on misunderstood commands

### Cloud & Kubernetes Standards (Phase IV+)

**Requirements**:
- 12-Factor App principles strictly enforced
- All configuration via environment variables
- Secrets stored in external secret managers (never in code/repos)
- Docker images must be reproducible and minimal
- Kubernetes manifests must be declarative (Helm/Kustomize)
- Health checks (liveness, readiness) required
- Resource limits defined for all containers
- Horizontal Pod Autoscaling configured where appropriate

**Forbidden**:
- Hard-coded credentials or API keys
- Imperative kubectl commands in production
- Mutable infrastructure
- Unversioned Docker images (no `latest` tag)

---

## IV. Repository Structure (MANDATORY)

### Phase I Structure (CLI):

```
/
├── .specify/
│   ├── memory/
│   │   └── constitution.md          # THIS FILE
│   ├── templates/                    # SDD templates
│   └── scripts/                      # Automation scripts
├── history/
│   ├── adr/                          # Architecture Decision Records
│   │   └── NNNN-decision-title.md
│   └── prompts/                      # Prompt History Records
│       ├── constitution/
│       ├── <feature-name>/
│       └── general/
├── specs/
│   └── <feature-name>/
│       ├── spec.md                   # Feature specification
│       ├── plan.md                   # Architecture plan
│       └── tasks.md                  # Task breakdown
├── src/
│   └── <phase-name>/                 # e.g., phase-1-cli
│       ├── core/                     # Domain logic
│       ├── interfaces/               # CLI
│       └── infrastructure/           # File I/O
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   └── README.md
├── README.md                         # Project overview
└── CLAUDE.md                         # AI agent instructions
```

### Phase II Structure (Full-Stack Monorepo - MANDATORY):

```
/
├── .specify/
│   ├── memory/
│   │   └── constitution.md          # THIS FILE
│   ├── templates/                    # SDD templates
│   └── scripts/                      # Automation scripts
├── .spec-kit/
│   └── config.yaml                   # Spec-Kit configuration
├── history/
│   ├── adr/                          # Architecture Decision Records
│   │   └── NNNN-decision-title.md
│   └── prompts/                      # Prompt History Records
│       ├── constitution/
│       ├── <feature-name>/
│       └── general/
├── specs/
│   └── <feature-name>/
│       ├── spec.md                   # Feature specification
│       ├── plan.md                   # Architecture plan
│       └── tasks.md                  # Task breakdown
├── frontend/                         # Next.js App
│   ├── CLAUDE.md                     # Frontend-specific AI instructions
│   ├── app/                          # App Router (pages, layouts)
│   ├── components/                   # React components
│   ├── lib/                          # Utilities, API client
│   ├── public/                       # Static assets
│   ├── tests/                        # Frontend tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── .env.local                    # Frontend environment variables
├── backend/                          # FastAPI App
│   ├── CLAUDE.md                     # Backend-specific AI instructions
│   ├── src/
│   │   ├── main.py                   # FastAPI entry point
│   │   ├── models/                   # SQLModel database models
│   │   ├── schemas/                  # Pydantic request/response schemas
│   │   ├── routers/                  # API route handlers
│   │   ├── middleware/               # JWT authentication middleware
│   │   ├── database.py               # Database connection
│   │   └── config.py                 # Configuration management
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── conftest.py               # Pytest fixtures
│   ├── pyproject.toml                # UV project configuration
│   ├── uv.lock                       # UV lock file
│   └── .env                          # Backend environment variables
├── docker-compose.yml                # Local development environment
├── .gitignore
├── README.md                         # Project overview and setup
└── CLAUDE.md                         # Root AI agent instructions
```

**Enforcement**: No alternative structures permitted. All new phases must follow this layout.

---

## V. Quality Standards (Global)

### Specification Quality

**Required Elements**:
- Clear problem statement
- User stories with acceptance criteria
- Edge cases and error scenarios explicitly listed
- Performance requirements (if applicable)
- Security considerations
- Success metrics

**Forbidden**:
- Ambiguous requirements ("should be fast", "user-friendly")
- Implementation details in specs (specs define WHAT, not HOW)
- Untestable acceptance criteria

### Code Quality

**Requirements**:
- Clean, readable, self-documenting code
- Consistent naming conventions
- Minimal complexity (cyclomatic complexity < 10 per function)
- No code duplication (DRY principle)
- Error handling for all failure modes
- Logging for debugging and audit trails

**Forbidden**:
- Over-engineering or premature optimization
- God objects or god functions
- Magic numbers or strings
- Dead code or commented-out code blocks

### Documentation Quality

**Required per Phase**:
- `README.md`: Setup instructions, dependencies, how to run
- `CLAUDE.md`: AI agent operational instructions
- Inline code comments for complex logic only
- API documentation (OpenAPI/Swagger for REST APIs)
- Database schema documentation

**Standards**:
- Documentation is versioned with code
- Outdated documentation is worse than no documentation (keep it current)
- Examples and usage patterns included

---

## VI. Security & Compliance

### Universal Security Rules

**Requirements**:
- Input validation on all external data
- SQL injection prevention (use SQLModel parameterized queries)
- XSS prevention (escape output, CSP headers)
- CSRF protection for state-changing operations
- Authentication and authorization for Phase II+
- Secrets management (environment variables, secret managers)
- HTTPS/TLS for all production traffic
- Regular dependency vulnerability scanning

**Forbidden**:
- Storing passwords in plaintext
- Trusting client-side validation alone
- Exposing sensitive data in logs or error messages
- Using deprecated cryptographic algorithms

### Data Privacy

**Requirements**:
- Minimal data collection (only what's needed)
- Clear data retention policies
- Secure data deletion mechanisms
- Privacy-by-design principles

---

## VII. Phase Evolution Rules

### Phase Transition Requirements

**Before Starting a New Phase**:
1. Previous phase must be complete and tested
2. ADR documenting the phase transition must exist
3. Migration plan documented (if data/schema changes)
4. Backward compatibility strategy defined
5. Regression test suite from prior phases passing

**Phase Independence**:
- Each phase is independently deployable
- Phase II does not require Phase I to be running (unless explicitly designed as extension)
- Clear interface boundaries between phases

### Supported Phases (Evolution Path)

**Phase I**: In-Memory Python CLI
- Core domain model
- CRUD operations
- File-based persistence (optional)
- CLI interface

**Phase II**: Full-Stack Web Application
- REST API (FastAPI)
- Next.js 16+ frontend (App Router)
- Database persistence (Neon PostgreSQL)
- Authentication and authorization (Better Auth + JWT)
- User isolation and multi-tenancy

**Phase III**: AI-Powered
- Natural language interface
- AI agent integration
- Smart suggestions and automation
- Voice/chat interfaces

**Phase IV**: Cloud-Native Distributed
- Microservices architecture
- Event-driven design (Kafka/RabbitMQ)
- Kubernetes deployment
- Scalability and fault tolerance

**Phase V**: Enterprise Features
- Multi-tenancy
- Advanced analytics
- Integrations (Slack, email, calendars)
- Audit logging and compliance

---

## VIII. Workflow Enforcement

### SDD Workflow (Strictly Required)

**Step 1: Constitution** (`/sp.constitution`)
- Establish or verify governing principles
- Run ONCE per project or on major pivots

**Step 2: Specify** (`/sp.specify`)
- Write clear, testable feature specification
- Human-authored, AI-assisted refinement
- Stored in `specs/<feature-name>/spec.md`

**Step 3: Plan** (`/sp.plan`)
- AI generates architecture plan from spec
- Identifies significant decisions requiring ADRs
- Stored in `specs/<feature-name>/plan.md`

**Step 4: Tasks** (`/sp.tasks`)
- AI breaks plan into granular, testable tasks
- Each task has clear acceptance criteria
- Stored in `specs/<feature-name>/tasks.md`

**Step 5: Implement** (`/sp.implement`)
- AI generates code from tasks
- AI writes tests
- Human reviews and approves

**Step 6: Record** (Automatic)
- Prompt History Record (PHR) created for session
- ADRs created for significant decisions (on human approval)

**Violations**: Skipping steps or working out-of-order invalidates the work.

### ADR Creation Rules

**When to Create ADRs** (Three-Part Test):
1. **Impact**: Does this have long-term consequences? (framework choice, data model, API design, security approach, platform selection)
2. **Alternatives**: Were multiple viable approaches considered with significant tradeoffs?
3. **Scope**: Does this decision affect multiple components or cross-cutting concerns?

If ALL three are true, suggest: "📋 Architectural decision detected: [brief-description] — Document reasoning and tradeoffs? Run `/sp.adr [decision-title]`"

Wait for human consent before creating the ADR.

**Decision Significance Categories**:
- **Framework/Platform**: FastAPI, Next.js, Kubernetes, Docker, etc.
- **Data Model**: Schema design, relationships, indexing strategy
- **Security Approach**: Authentication method, encryption, access controls
- **Architecture Pattern**: Monolith vs microservices, event-driven vs request-response
- **Technology Choice**: Database selection, message queue, cloud provider

---

## IX. Compliance & Verification

### Constitution Compliance Checks

**Mandatory Verifications**:
- Every pull request must verify compliance with ALL constitutional principles
- Code reviews must explicitly check for violations
- Automated checks should flag potential non-compliance
- Release gates must include constitutional compliance verification

**Compliance Reporting**:
- Quarterly compliance audits
- Automated compliance dashboards
- Violation tracking and remediation
- Training records for team members

### Amendment Process

**Constitution Updates Require**:
1. Clear justification for the change
2. Impact assessment on existing artifacts
3. Team consensus/approval process
4. Migration plan for affected components
5. Updated documentation across all dependent files

**Versioning Policy**:
- MAJOR: Breaking changes to core principles or workflows
- MINOR: New principles, expanded guidelines, or non-breaking enhancements
- PATCH: Typo fixes, clarifications, or minor wording improvements

---

**Version**: 1.0.0 | **Ratified**: 2025-12-18 | **Last Amended**: 2025-12-18
```

## Response snapshot

The constitution file at `.specify/memory/constitution.md` has been successfully updated with the complete "The Evolution of Todo" project constitution. The template placeholders were replaced with comprehensive content covering:

1. Core Principles (Spec-Driven Development, AI as Primary Developer, Mandatory Traceability, Test-First Mandate, Evolutionary Consistency)
2. Domain Model Governance (Todo domain rules across phases)
3. Technology Governance (standards for different phases)
4. Repository Structure (mandated layouts for Phase I and Phase II+)
5. Quality Standards (specification, code, and documentation quality)
6. Security & Compliance requirements
7. Phase Evolution Rules
8. Workflow Enforcement (SDD workflow)
9. ADR Creation Rules
10. Compliance & Verification procedures

An HTML comment with a sync impact report was added at the top of the file, indicating the version change (N/A → 1.0.0), all sections added, and template files that should be reviewed for alignment with the new constitution.

A Prompt History Record (PHR) was created at `history/prompts/constitution/0001-update-constitution.constitution.prompt.md` documenting this change.

## Outcome

- ✅ Impact: Complete overhaul of project governance with comprehensive constitution established
- 🧪 Tests: No tests needed for constitution update
- 📁 Files: Updated .specify/memory/constitution.md with full constitution content
- 🔁 Next prompts: Project can now proceed with feature specifications following the SDD workflow
- 🧠 Reflection: The constitution establishes clear governance for the entire project lifecycle

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - Constitution successfully updated with all required sections
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin feature specification using /sp.specify command
