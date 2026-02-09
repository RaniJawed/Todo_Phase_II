# API Contracts

This directory contains the OpenAPI specifications for the Task CRUD Operations with Authentication feature.

## Contracts

- `auth.openapi.yaml` - Authentication endpoints (register, login, logout)
- `tasks.openapi.yaml` - Task management endpoints (CRUD operations)

## Versioning

All APIs follow the format `/api/v1/` for the initial version. Breaking changes will result in new version paths (e.g., `/api/v2/`).

## Authentication

All task-related endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

## Error Handling

All API endpoints follow a consistent error response format:
```json
{
  "success": false,
  "message": "Error description",
  "error_code": "ERROR_CODE"
}
```

## Data Validation

All endpoints perform validation according to the schemas defined in the OpenAPI specifications. Invalid requests will return 400 status codes with specific error messages.