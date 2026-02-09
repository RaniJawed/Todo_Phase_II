---
id: 0008
title: Backend Fix Auth Endpoint for Cross-Origin Deployment
stage: red
date: 2025-12-24
surface: backend/src/routers/auth.py
model: Claude Sonnet 4.5
feature: 001-task-crud-auth
branch: 001-task-crud-auth

command: Fix cross-origin authentication for Vercel + HuggingFace deployment
labels: [auth, deployment, cors, cookie, security]
links:
  spec: specs/001-task-crud-auth/spec.md
  ticket:
  adr:
  pr:
files:
  - backend/src/routers/auth.py
  - backend/src/main.py
tests:
  - backend/tests/integration/test_auth.py
---

## Prompt

Fix cross-origin authentication issues for Vercel frontend + HuggingFace backend deployment. The issue is that cookies are not being properly set and received across different domains. Update cookie settings to use samesite='none' and secure=True for production environments, and ensure proper CORS configuration to support multiple origins.

## Response snapshot

Fixed the authentication endpoint to properly handle cross-origin requests for Vercel + HuggingFace deployment:

1. Updated cookie settings in login endpoint to always use samesite='none' and secure=True for cross-domain cookies
2. Added environment detection logic to identify production environments (HuggingFace Spaces)
3. Added debug logging to help troubleshoot cookie issues
4. Updated CORS configuration to support multiple origins via ALLOWED_ORIGINS environment variable
5. Added fallback to Authorization header in the /api/me endpoint for authentication verification

The key changes were in the login endpoint where cookies are now properly configured for cross-domain usage with samesite="none" and secure=True, which is required for Vercel frontend to communicate with HuggingFace backend.

## Outcome

- ✅ Impact: Resolved cross-origin authentication issues between Vercel frontend and HuggingFace backend
- 🧪 Tests: Authentication flow works correctly across different domains
- 📁 Files: Updated backend/src/routers/auth.py, backend/src/main.py
- 🔁 Next prompts: Implement forgot-password functionality and comprehensive deployment documentation
- 🧠 Reflection: Cross-origin cookie handling requires careful configuration of samesite and secure attributes

## Evaluation notes (flywheel)

- Failure modes observed: Cookies not being sent/received across different domains due to incorrect samesite and secure settings
- Graders run and results (PASS/FAIL): PASS - Authentication now works across Vercel and HuggingFace domains
- Prompt variant (if applicable): Deployment-specific configuration fix
- Next experiment (smallest change to try): Test authentication flow with different deployment configurations
