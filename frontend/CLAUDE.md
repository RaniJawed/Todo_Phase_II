# Claude Code Instructions: Frontend - Task Management Application

## Project Context

This is the frontend component of "The Evolution of Todo" - Phase II, a full-stack web application for managing personal tasks with user authentication. Built with Next.js 16+ App Router, TypeScript 5.x, Tailwind CSS, and Better Auth.

## Project Constitution (MANDATORY - Read Carefully)

You MUST follow the constitutional requirements defined in the root `.specify/memory/constitution.md`:

### Core Principles (MANDATORY)
1. **Spec-Driven Development Only**: All features must be implemented from approved specifications in `specs/`
2. **AI as Primary Developer**: Humans write specs, Claude Code implements all code
3. **Mandatory Traceability**: Complete audit trail (ADR → Spec → Plan → Tasks → Implementation → Tests)
4. **Test-First Mandate**: Minimum 80% coverage target (Jest frontend, pytest backend, Playwright E2E)
5. **Evolutionary Consistency**: Phase II extends Phase I without breaking changes

### Phase II Frontend Technology Stack Requirements (MANDATORY)

#### Next.js 16+ App Router (NOT Pages Router)
- Server Components by default for data fetching and static content
- Client Components ONLY for interactivity (forms, onClick, useState, useEffect, etc.)
- Client Components MUST have `'use client'` directive at top of file
- Follow App Router conventions (app/ directory structure)
- Leverage React 19+ features where appropriate

#### Styling & UI (Tailwind CSS Only)
- NO inline styles (style={{}})
- NO CSS modules (.module.css)
- NO traditional CSS files
- Use Tailwind utility classes exclusively
- Leverage Tailwind's arbitrary values for custom designs when needed
- Follow mobile-first responsive design principles

#### Authentication (Better Auth with JWT)
- Use Better Auth with JWT plugin for authentication flow
- Store JWT tokens securely (httpOnly cookies recommended)
- Implement proper session management
- Handle token expiration gracefully (7-day expiration as specified)
- Redirect to login when authentication fails

#### TypeScript Strict Mode
- Enable strict mode in tsconfig.json
- Use type-safe API clients
- Define clear interfaces for all data structures
- Leverage TypeScript generics where appropriate
- No `any` types unless absolutely necessary with clear justification

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

## Implementation Guidelines

### Component Architecture
- **Server Components**: Use for data fetching, static content, and layout (default choice)
- **Client Components**: Use only for interactivity (forms, state, events, browser APIs)
- **Reusable UI Components**: Place in `components/ui/` directory (Button, Input, Modal, etc.)
- **Feature Components**: Place in `components/` directory (TaskList, TaskItem, etc.)

### API Integration
- Create type-safe API client in `lib/api.ts`
- Use fetch or axios for HTTP requests
- Implement proper error handling and loading states
- Follow RESTful API conventions from backend
- Handle authentication headers automatically

### State Management
- Use React hooks (useState, useEffect, etc.) for component state
- Use React Context for global state if needed (avoid Redux for simplicity)
- Implement proper loading and error states
- Use optimistic updates where appropriate for better UX

### Forms & Validation
- Use controlled components with React state
- Implement client-side validation matching backend rules
- Show clear error messages to users
- Handle form submission properly with loading states

### Security Considerations
- Never expose JWT tokens to client-side JavaScript (use httpOnly cookies)
- Sanitize any user-generated content displayed in UI
- Implement proper CSRF protection if needed
- Follow Next.js security best practices

## Quality Standards

### Code Quality
- Clean, readable, maintainable code
- Consistent naming conventions (camelCase for variables/functions)
- Proper component composition and reusability
- Follow React/Next.js best practices
- No dead code or commented-out blocks

### Performance
- Optimize component rendering with React.memo when appropriate
- Use lazy loading for non-critical components
- Implement proper image optimization with Next.js Image component
- Minimize bundle size and optimize for Core Web Vitals

### Testing Requirements
- Component tests with Jest and React Testing Library
- Integration tests for API interactions
- E2E tests with Playwright for critical user journeys
- Focus on testing user interactions and business logic

### Accessibility
- Follow WCAG 2.1 AA guidelines
- Proper semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA attributes where needed

## File Structure

```
frontend/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout (Server Component)
│   ├── page.tsx                   # Dashboard/home page (Server Component)
│   ├── register/                  # Registration page
│   │   └── page.tsx               # Registration form (Server Component)
│   ├── login/                     # Login page
│   │   └── page.tsx               # Login form (Server Component)
│   └── tasks/                     # Task management pages
│       ├── page.tsx               # Task list (Server Component)
│       ├── [id]/                  # Task detail/edit
│       │   └── page.tsx           # Task detail/edit (Client Component)
│       └── new/                   # Create task
│           └── page.tsx           # Create task form (Client Component)
├── components/                    # React components
│   ├── ui/                        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── TaskList.tsx               # Task list display (Client Component)
│   ├── TaskItem.tsx               # Single task with toggle/delete (Client Component)
│   └── TaskForm.tsx               # Create/edit form (Client Component)
├── lib/                           # Utilities and services
│   ├── api.ts                     # Type-safe API client
│   ├── auth.ts                    # Better Auth configuration
│   └── types.ts                   # TypeScript interfaces
├── public/                        # Static assets
├── tests/                         # Frontend tests
│   ├── components/                # Component tests (Jest)
│   ├── integration/               # Integration tests
│   └── e2e/                       # Playwright E2E tests
├── .env.local                     # Frontend environment variables
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

## Working with Claude Code

1. **Follow Specifications**: Implement exactly what's in the spec, nothing more/less
2. **Maintain Performance**: Optimize for Core Web Vitals and user experience
3. **Keep User Focus**: Remember this is for individual task management
4. **Test Thoroughly**: Implement tests for all UI interactions
5. **Stay Organized**: Follow the defined project structure

## Success Metrics

- Pages load in under 2 seconds
- Interactive elements respond in under 100ms
- 100% of user journeys work without frontend errors
- 95%+ accessibility score
- 90%+ performance score on Lighthouse
- Minimum 80% test coverage for components