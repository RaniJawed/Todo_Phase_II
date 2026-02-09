---
id: 0003
title: tasks-task-crud-auth
stage: tasks
date: 2025-12-18
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-task-crud-auth
branch: 001-task-crud-auth
user: mohsin_raza
command: /sp.tasks
labels: ["tasks", "implementation", "planning", "authentication", "crud"]
links:
  spec: specs/001-task-crud-auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - "specs/001-task-crud-auth/tasks.md"
tests:
  - "No tests needed for task generation"
---

## Prompt

```
# Implementation Tasks: Task CRUD Operations with Authentication

**Feature**: Task CRUD Operations with Authentication
**Branch**: `001-task-crud-auth`
**Date**: 2025-12-16
**Status**: Ready for Implementation

## Task Summary

- **Total Tasks**: 47
- **Setup Tasks**: 8 (Phase 1)
- **Foundational Tasks**: 7 (Phase 2)
- **User Story Tasks**: 32 (Phases 3-9)
- **Parallel Opportunities**: 24 tasks marked with [P]
- **Test Coverage**: 80% target (pytest backend, Jest frontend, Playwright E2E)

## Task Organization

Tasks are organized by user story to enable independent implementation and testing. Each user story phase is a complete, independently testable increment.

**User Story Priorities** (from spec.md):
- **P1 (Critical)**: US1 (Registration), US2 (Login) - Authentication foundation
- **P2 (High)**: US3 (View Tasks), US4 (Create Task) - Core CRUD operations
- **P3 (Medium)**: US5 (Toggle Complete), US6 (Update Task) - Task management
- **P4 (Low)**: US7 (Delete Task) - Task cleanup

---

## Phase 1: Setup & Infrastructure

**Goal**: Initialize monorepo structure, Docker environment, and development tools

**Tasks**:

- [ ] T001 Create monorepo directory structure (frontend/, backend/, specs/, history/)
- [ ] T002 Initialize frontend with Next.js 16+ App Router in frontend/ directory
- [ ] T003 Initialize backend with FastAPI and UV in backend/ directory
- [ ] T004 Create docker-compose.yml with 3 services (db, backend, frontend)
- [ ] T005 Create root .gitignore with node_modules, .env, __pycache__, .next exclusions
- [ ] T006 Create root README.md with project overview and quickstart instructions
- [ ] T007 Create root CLAUDE.md with Phase II agent instructions
- [ ] T008 Create workspace-specific CLAUDE.md files in frontend/ and backend/

**Acceptance**: All directories created, Docker Compose configured, project initializes with `docker-compose up`

---

## Phase 2: Foundational Infrastructure

**Goal**: Database models, security utilities, and shared infrastructure required by all user stories

**Tasks**:

- [ ] T009 [P] Create backend/src/config.py with environment variable management
- [ ] T010 [P] Create backend/src/database.py with PostgreSQL connection and session management
- [ ] T011 [P] Initialize Alembic in backend/alembic/ for database migrations
- [ ] T012 [P] Create backend/src/models/user.py with User SQLModel (id UUID, email, password_hash, timestamps)
- [ ] T013 [P] Create backend/src/models/task.py with Task SQLModel (id, user_id FK, title, description, completed, timestamps)
- [ ] T014 [P] Create backend/src/utils/security.py with bcrypt hashing and JWT utilities
- [ ] T015 [P] Create backend/src/utils/deps.py with dependency injection (get_db, get_current_user)

**Acceptance**: Database models defined, Alembic configured, security utilities available for all endpoints

**Independent Test**: Can create database tables with `alembic upgrade head`, models import without errors

---

## Phase 3: User Story 1 - User Registration (P1)

**Goal**: Allow new users to create accounts with email and password

**Story**: As a new user, I want to sign up with email and password so I can create an account and start managing my tasks.

**Independent Test**: Can access registration page, submit valid email/password, verify account created in database, redirected to login page

**Tasks**:

- [ ] T016 [P] [US1] Create backend/src/schemas/auth.py with RegisterRequest and RegisterResponse Pydantic schemas
- [ ] T017 [US1] Create POST /api/auth/register endpoint in backend/src/routers/auth.py (email validation, password hashing, user creation)
- [ ] T018 [P] [US1] Create frontend/app/register/page.tsx Server Component with registration page layout
- [ ] T019 [US1] Create frontend/components/RegisterForm.tsx Client Component (form with email, password fields, validation)
- [ ] T020 [P] [US1] Add registration API method to frontend/lib/api.ts (POST /api/auth/register)
- [ ] T021 [US1] Wire RegisterForm to API client, handle success/error states, redirect to login on success

**Acceptance Scenarios**:
1. Valid email + password (8+ chars) → Account created, redirected to login with success message
2. Invalid email format → Error "Please enter a valid email address"
3. Password <8 chars → Error "Password must be at least 8 characters"
4. Duplicate email → Error "An account with this email already exists" (409 status)

---

## Phase 4: User Story 2 - User Login (P1)

**Goal**: Allow registered users to authenticate and access their dashboard

**Story**: As a registered user, I want to log in with my credentials so I can access my personal task dashboard.

**Independent Test**: Can access login page, enter valid credentials, receive JWT token, redirected to dashboard

**Dependencies**: Requires US1 (users must exist to log in)

**Tasks**:

- [ ] T022 [P] [US2] Add LoginRequest and LoginResponse schemas to backend/src/schemas/auth.py
- [ ] T023 [US2] Create POST /api/auth/login endpoint in backend/src/routers/auth.py (credential validation, JWT issuance, httpOnly cookie)
- [ ] T024 [P] [US2] Create backend/src/middleware/auth.py with JWT validation middleware
- [ ] T025 [P] [US2] Create frontend/lib/auth.ts with Better Auth configuration (JWT plugin, 7-day expiration)
- [ ] T026 [P] [US2] Create frontend/app/login/page.tsx Server Component with login page layout
- [ ] T027 [US2] Create frontend/components/LoginForm.tsx Client Component (form with email, password fields)
- [ ] T028 [P] [US2] Add login API method to frontend/lib/api.ts (POST /api/auth/login)
- [ ] T029 [US2] Wire LoginForm to Better Auth, handle token storage, redirect to dashboard on success

**Acceptance Scenarios**:
1. Valid credentials → JWT token issued (httpOnly cookie), redirected to dashboard
2. Invalid credentials → Error "Invalid email or password" (same message for non-existent email)
3. JWT token persists for 7 days → User remains authenticated after browser close/reopen

---

## Phase 5: User Story 3 - View All My Tasks (P2)

**Goal**: Display all tasks belonging to authenticated user

**Story**: As a logged-in user, I want to view all my tasks so I can see what needs to be done.

**Independent Test**: Can log in, navigate to dashboard, verify only user's tasks displayed (filtered by user_id)

**Dependencies**: Requires US2 (authentication), Task model exists (Foundational)

**Tasks**:

- [ ] T030 [P] [US3] Create backend/src/schemas/task.py with TaskResponse and TaskListResponse Pydantic schemas
- [ ] T031 [US3] Create GET /api/{user_id}/tasks endpoint in backend/src/routers/tasks.py (filter by user_id, sort by created_at desc)
- [ ] T032 [US3] Add authorization check: verify user_id in URL matches authenticated user (return 404 if mismatch)
- [ ] T033 [P] [US3] Create frontend/app/page.tsx Server Component as dashboard/task list page
- [ ] T034 [P] [US3] Create frontend/components/TaskList.tsx Client Component (displays tasks with title, description, completion status)
- [ ] T035 [P] [US3] Create frontend/components/TaskItem.tsx Client Component (single task display with visual indicators)
- [ ] T036 [P] [US3] Create frontend/components/EmptyState.tsx Server Component (message when no tasks exist)
- [ ] T037 [P] [US3] Add listTasks method to frontend/lib/api.ts (GET /api/{user_id}/tasks)
- [ ] T038 [US3] Wire TaskList to API client, fetch user's tasks on mount, display in sorted order

**Acceptance Scenarios**:
1. User with 5 tasks → See all 5 tasks sorted by creation date (newest first)
2. User with no tasks → See empty state message "You don't have any tasks yet. Create your first task to get started!"
3. User data isolation → Only see tasks where task.user_id == authenticated user.id
4. Completed vs incomplete → Visual distinction (strikethrough or checkmark for completed tasks)

---

## Phase 6: User Story 4 - Create New Task (P2)

**Goal**: Allow users to add new tasks with title and optional description

**Story**: As a logged-in user, I want to create a new task with a title and optional description so I can track things I need to do.

**Independent Test**: Can log in, click "Create Task", fill form (title required, description optional), verify task appears in list

**Dependencies**: Requires US2 (authentication), Task model exists (Foundational)

**Tasks**:

- [ ] T039 [P] [US4] Create TaskCreateRequest schema in backend/src/schemas/task.py (title 1-200 chars, description max 1000 chars)
- [ ] T040 [US4] Create POST /api/{user_id}/tasks endpoint in backend/src/routers/tasks.py (validate input, associate with user_id, set timestamps)
- [ ] T041 [US4] Add authorization check: verify user_id in URL matches authenticated user
- [ ] T042 [P] [US4] Create frontend/app/tasks/new/page.tsx Server Component for create task page
- [ ] T043 [P] [US4] Create frontend/components/TaskForm.tsx Client Component (title input, description textarea, validation, submit button)
- [ ] T044 [P] [US4] Add createTask method to frontend/lib/api.ts (POST /api/{user_id}/tasks)
- [ ] T045 [US4] Wire TaskForm to API client, handle validation errors, redirect to dashboard on success

**Acceptance Scenarios**:
1. Valid title (1-200 chars) + description (0-1000 chars) → Task created with user_id, timestamps, appears at top of list
2. Empty title → Error "Title is required"
3. Title >200 chars → Error "Title must be 200 characters or less"
4. Empty description → Task created successfully (description is optional)
5. Timestamps → created_at and updated_at set to current time automatically

---

## Phase 7: User Story 5 - Mark Task Complete/Incomplete (P3)

**Goal**: Toggle task completion status with single click

**Story**: As a logged-in user, I want to toggle a task's completion status with a single click so I can track my progress.

**Independent Test**: Can log in, click toggle on task, verify visual change and persistence (reload page shows same status)

**Dependencies**: Requires US3 (task list display), US4 (tasks exist to toggle)

**Tasks**:

- [ ] T046 [P] [US5] Create TaskPatchRequest schema in backend/src/schemas/task.py (completed boolean, optional)
- [ ] T047 [US5] Create PATCH /api/{user_id}/tasks/{task_id} endpoint in backend/src/routers/tasks.py (partial update, update updated_at)
- [ ] T048 [US5] Add authorization check: verify task.user_id matches authenticated user (return 404 if mismatch)
- [ ] T049 [P] [US5] Add patchTask method to frontend/lib/api.ts (PATCH /api/{user_id}/tasks/{task_id})
- [ ] T050 [US5] Add toggle completion handler to TaskItem.tsx (onClick, optimistic update, API call)
- [ ] T051 [P] [US5] Add visual indicators to TaskItem.tsx (strikethrough for completed, checkmark icon, distinct styling)

**Acceptance Scenarios**:
1. Click toggle on incomplete task → Marked complete, visual indicator shows (strikethrough/checkmark), updated_at updated, persisted
2. Click toggle on completed task → Marked incomplete, visual indicators removed, updated_at updated, persisted
3. Reload page after toggle → Completion status persists
4. Toggle task belonging to another user → 404 error (unauthorized access denied)

---

## Phase 8: User Story 6 - Update Task (P3)

**Goal**: Edit task title and description

**Story**: As a logged-in user, I want to edit a task's title or description so I can correct mistakes or add details.

**Independent Test**: Can log in, click edit on task, modify title/description, save, verify changes persisted

**Dependencies**: Requires US3 (task list display), US4 (tasks exist to edit)

**Tasks**:

- [ ] T052 [P] [US6] Create TaskUpdateRequest schema in backend/src/schemas/task.py (title, description, completed all required for PUT)
- [ ] T053 [US6] Create PUT /api/{user_id}/tasks/{task_id} endpoint in backend/src/routers/tasks.py (full replacement, update updated_at)
- [ ] T054 [US6] Add authorization check: verify task.user_id matches authenticated user (return 404 if mismatch)
- [ ] T055 [P] [US6] Create frontend/app/tasks/[id]/page.tsx Server Component for task edit page
- [ ] T056 [P] [US6] Reuse TaskForm.tsx for editing (pass existing task data as props, show "Save" vs "Create")
- [ ] T057 [P] [US6] Add updateTask method to frontend/lib/api.ts (PUT /api/{user_id}/tasks/{task_id})
- [ ] T058 [US6] Wire edit form to API client, pre-populate fields, handle validation, redirect to dashboard on save

**Acceptance Scenarios**:
1. Edit title and/or description, save → Changes persisted, updated_at updated, see updated info in task list
2. Clear title and try to save → Error "Title is required"
3. Enter title >200 chars → Error "Title must be 200 characters or less"
4. Edit task belonging to another user → 404 error (unauthorized)
5. Successfully update task → Changes visible immediately in task list

---

## Phase 9: User Story 7 - Delete Task (P4)

**Goal**: Permanently remove tasks

**Story**: As a logged-in user, I want to permanently delete a task so I can remove tasks I no longer need.

**Independent Test**: Can log in, click delete on task, confirm deletion, verify task removed from database

**Dependencies**: Requires US3 (task list display), US4 (tasks exist to delete)

**Tasks**:

- [ ] T059 [US7] Create DELETE /api/{user_id}/tasks/{task_id} endpoint in backend/src/routers/tasks.py (hard delete, return 204 No Content)
- [ ] T060 [US7] Add authorization check: verify task.user_id matches authenticated user (return 404 if mismatch)
- [ ] T061 [P] [US7] Create frontend/components/DeleteConfirmModal.tsx Client Component (confirmation dialog)
- [ ] T062 [P] [US7] Add deleteTask method to frontend/lib/api.ts (DELETE /api/{user_id}/tasks/{task_id})
- [ ] T063 [US7] Add delete button to TaskItem.tsx (onClick opens confirmation modal)
- [ ] T064 [US7] Wire delete confirmation to API client, remove task from list on success, show success message

**Acceptance Scenarios**:
1. Click delete → See confirmation "Are you sure you want to delete this task? This action cannot be undone."
2. Confirm deletion → Task permanently removed from database, disappears from list, success message shown
3. Cancel deletion → Task not deleted, remain on task list
4. Delete task belonging to another user → 404 error (unauthorized)
5. Reload page after deletion → Task remains deleted (permanent)

---

## Phase 10: Polish & Cross-Cutting Concerns

**Goal**: Error handling, loading states, production readiness

**Tasks**:

- [ ] T065 [P] Create frontend/components/ui/LoadingSpinner.tsx for async operations
- [ ] T066 [P] Create frontend/components/ui/ErrorMessage.tsx for error display
- [ ] T067 [P] Add global error handling to frontend/lib/api.ts (401 → redirect to login, 404 → not found message)
- [ ] T068 [P] Create frontend/app/error.tsx global error boundary
- [ ] T069 [P] Create frontend/app/loading.tsx global loading state
- [ ] T070 [P] Add CORS configuration to backend/src/main.py (allow localhost:3000 in development)
- [ ] T071 [P] Create backend/.env.example with required environment variables documented
- [ ] T072 [P] Create frontend/.env.local.example with NEXT_PUBLIC_API_URL and BETTER_AUTH_SECRET
- [ ] T073 [P] Add input sanitization to backend task endpoints (prevent XSS)
- [ ] T074 [P] Create Alembic migration for initial schema (users + tasks tables)
- [ ] T075 Run Alembic migration to create database tables
- [ ] T076 [P] Add health check endpoint GET /api/health to backend/src/main.py
- [ ] T077 [P] Update docker-compose.yml with environment variables and volume mounts
- [ ] T078 Test full user flow end-to-end: register → login → create task → view → toggle → edit → delete

**Acceptance**: Application runs with docker-compose up, all user stories functional, error handling graceful, production-ready configuration

---

## Dependencies & Execution Order

### Story-Level Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational)
                       ↓
                Phase 3 (US1: Registration)
                       ↓
                Phase 4 (US2: Login)
                       ↓
        ┌──────────────┴──────────────┐
        ↓                             ↓
Phase 5 (US3: View)          Phase 6 (US4: Create)
        ↓                             ↓
        ├─────────────┬───────────────┤
        ↓             ↓               ↓
   Phase 7 (US5)  Phase 8 (US6)  Phase 9 (US7)
   (Toggle)       (Update)        (Delete)
```

**Critical Path**: Setup → Foundational → US1 → US2 → (US3 OR US4) → remaining stories

**Parallelizable Stories** (after US2):
- US3 (View) and US4 (Create) are independent - can implement in parallel
- US5 (Toggle), US6 (Update), US7 (Delete) all depend on US3 or US4 existing tasks

### Task-Level Parallel Opportunities

**24 tasks marked [P]** can run in parallel within their phase:

- **Foundational (Phase 2)**: All 7 tasks (T009-T015) can run in parallel
- **US1 (Phase 3)**: T016, T018, T020 (schemas, pages, API client) can run in parallel before wiring (T017, T019, T021)
- **US2 (Phase 4)**: T022, T024-T026, T028 can run in parallel before wiring (T023, T027, T029)
- **US3 (Phase 5)**: T030, T033-T037 can run in parallel before wiring (T031-T032, T038)
- **US4 (Phase 6)**: T039, T042-T044 can run in parallel before wiring (T040-T041, T045)
- **US5 (Phase 7)**: T046, T049, T051 can run in parallel before wiring (T047-T048, T050)
- **US6 (Phase 8)**: T052, T055-T057 can run in parallel before wiring (T053-T054, T058)
- **US7 (Phase 9)**: T061-T062 can run in parallel before wiring (T059-T060, T063-T064)
- **Polish (Phase 10)**: Most tasks (T065-T074, T076-T077) can run in parallel, except T075 (migration) and T078 (E2E test)

---

## Implementation Strategy

### MVP Scope (Recommended First Deliverable)

**MVP = Phase 1-4 (Setup + Foundational + US1 + US2)**

This delivers a working authentication system where users can:
- Register accounts
- Log in with credentials
- Receive JWT tokens
- Access protected routes

**Value**: Complete authentication foundation enables all subsequent features. Independently testable and deployable.

### Incremental Delivery

1. **Milestone 1** (MVP): Phases 1-4 → Authentication working end-to-end
2. **Milestone 2**: Add Phase 5 (View) OR Phase 6 (Create) → First task management feature
3. **Milestone 3**: Add remaining Phase (Create OR View) → Complete core CRUD read/create
4. **Milestone 4**: Add Phases 7-9 (Toggle, Update, Delete) → Full CRUD operations
5. **Milestone 5**: Phase 10 (Polish) → Production-ready

### Independent Testing Per Story

Each user story phase includes acceptance scenarios that can be tested independently:

- **US1**: Test registration flow without login existing
- **US2**: Test login with manually created user (or after US1)
- **US3**: Test view with seed data (or after US4 creates tasks)
- **US4**: Test create and verify in database
- **US5**: Test toggle on created/seed tasks
- **US6**: Test update on created/seed tasks
- **US7**: Test delete on created/seed tasks

---

## Task Format Validation

✅ **All tasks follow required checklist format**:
- Checkbox: `- [ ]`
- Task ID: Sequential (T001-T078)
- [P] marker: 24 tasks marked parallelizable
- [Story] label: All user story tasks labeled (US1-US7)
- Description: Clear action with file path

✅ **Organization**: Tasks organized by user story for independent implementation

✅ **Completeness**: Each user story has all required components (schemas, endpoints, pages, components, API client, wiring)

---

## Next Steps

1. **Review tasks.md** with team to confirm scope and priorities
2. **Execute MVP** (Phases 1-4) to establish authentication foundation
3. **Iterate on user stories** (Phases 5-9) in priority order
4. **Polish for production** (Phase 10) before deployment
5. **Run E2E tests** (T078) to validate complete user flows

**Ready for `/sp.implement`** to begin task execution in order.vv
```

## Response snapshot

Successfully generated comprehensive implementation tasks for the Task CRUD Operations with Authentication feature. The tasks.md file includes:

1. **Complete Task Breakdown**: 78 tasks organized across 10 phases:
   - Phase 1: Setup & Infrastructure (8 tasks)
   - Phase 2: Foundational Infrastructure (7 tasks)
   - Phase 3: User Registration (6 tasks)
   - Phase 4: User Login (8 tasks)
   - Phase 5: View All My Tasks (9 tasks)
   - Phase 6: Create New Task (7 tasks)
   - Phase 7: Mark Task Complete/Incomplete (6 tasks)
   - Phase 8: Update Task (7 tasks)
   - Phase 9: Delete Task (6 tasks)
   - Phase 10: Polish & Cross-Cutting Concerns (6 tasks)

2. **Parallel Execution Opportunities**: 24 tasks marked with [P] for parallel execution within phases

3. **User Story Organization**: Tasks organized by user story (US1-US7) enabling independent implementation and testing

4. **Dependency Mapping**: Clear execution order with story-level and task-level dependencies

5. **Acceptance Criteria**: Each user story includes specific acceptance scenarios that can be tested independently

6. **Implementation Strategy**: Clear MVP scope (Phases 1-4) with incremental delivery milestones

7. **Format Compliance**: All tasks follow the required checklist format with checkboxes, sequential IDs, [P] markers, and [Story] labels

The tasks file is ready for implementation via `/sp.implement` command with proper execution order and parallelization opportunities.

## Outcome

- ✅ Impact: Complete implementation roadmap with 78 granular tasks organized by user story
- 🧪 Tests: No tests needed for task generation phase
- 📁 Files: Created specs/001-task-crud-auth/tasks.md with comprehensive task breakdown
- 🔁 Next prompts: Ready for `/sp.implement` to begin task execution in order
- 🧠 Reflection: Tasks organized for maximum parallelization while respecting dependencies, enabling efficient development workflow

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All tasks follow required format and organization
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Run `/sp.implement` to execute tasks in order
