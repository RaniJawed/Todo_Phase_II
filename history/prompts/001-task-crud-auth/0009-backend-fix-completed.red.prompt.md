---
id: 0009
title: Backend Fix Task Completion Toggle Endpoint
stage: red
date: 2025-12-24
surface: backend/src/routers/tasks.py
model: Claude Sonnet 4.5
feature: 001-task-crud-auth
branch: 001-task-crud-auth

command: Fix task completion toggle functionality
labels: [tasks, completion, patch, endpoint]
links:
  spec: specs/001-task-crud-auth/spec.md
  ticket:
  adr:
  pr:
files:
  - backend/src/routers/tasks.py
  - backend/src/schemas/task.py
  - backend/src/models/task.py
tests:
  - backend/tests/integration/test_tasks.py
---

## Prompt

Fix the task completion toggle functionality in the PATCH endpoint. The issue is that the completed field in the TaskPatchRequest schema needs to properly handle partial updates for the completion status. Ensure the PATCH endpoint correctly updates only the completed field while maintaining other task properties, and that the updated_at timestamp is properly updated when toggling completion status.

## Response snapshot

Fixed the task completion toggle functionality in the PATCH endpoint:

1. Updated the TaskPatchRequest schema to properly handle optional boolean for completion status
2. Modified the PATCH endpoint to only update the completed field when provided in the request
3. Ensured the updated_at timestamp is automatically updated when toggling completion status
4. Added proper authorization checks to ensure users can only toggle completion status of their own tasks
5. Maintained data isolation by filtering by user_id in all queries

The key changes were in the PATCH endpoint where we now properly handle partial updates for the completed field, ensuring that only the completion status is updated while other task properties remain unchanged. The updated_at timestamp is properly managed to reflect when the completion status was last changed.

## Outcome

- ✅ Impact: Task completion toggle now works correctly with proper partial updates
- 🧪 Tests: Completion status can be toggled without affecting other task properties
- 📁 Files: Updated backend/src/routers/tasks.py, backend/src/schemas/task.py
- 🔁 Next prompts: Enhance task management with additional features and improve error handling
- 🧠 Reflection: Partial updates require careful handling of optional fields in request schemas

## Evaluation notes (flywheel)

- Failure modes observed: Incomplete handling of optional boolean fields in PATCH requests
- Graders run and results (PASS/FAIL): PASS - Task completion toggle works as expected
- Prompt variant (if applicable): Partial update endpoint fix
- Next experiment (smallest change to try): Add validation for task completion status updates


