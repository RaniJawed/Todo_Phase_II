# Data Model: Task CRUD Operations with Authentication

**Feature**: Task CRUD Operations with Authentication (001-task-crud-auth)
**Date**: 2025-12-18
**Status**: Complete

## Overview

This document defines the data model for the task management application with user authentication. The model extends the Phase I base model with user-specific fields while maintaining backward compatibility.

## Entity Definitions

### User Entity

**Purpose**: Represents an authenticated account in the system

**Attributes**:
- `id`: UUID (Primary Key, unique identifier)
- `email`: String (unique, indexed, max 255 chars, validated format)
- `password_hash`: String (hashed with bcrypt, stored securely)
- `created_at`: DateTime (ISO 8601 format, UTC, indexed)
- `updated_at`: DateTime (ISO 8601 format, UTC)

**Constraints**:
- Email must be unique across all users
- Email format must be validated (contains @, valid domain structure)
- Password must be at least 8 characters (enforced during registration)
- created_at and updated_at are automatically managed by the system

**Indexes**:
- Primary key on `id`
- Unique index on `email`
- Index on `created_at`

**Relationships**:
- One User has many Tasks (foreign key: Task.user_id references User.id)

### Task Entity

**Purpose**: Represents a todo item belonging to a specific user

**Attributes**:
- `id`: Integer (Auto-increment Primary Key, unique identifier)
- `user_id`: UUID (Foreign Key, references User.id, indexed)
- `title`: String (1-200 characters, required)
- `description`: String (optional, max 1000 characters)
- `completed`: Boolean (default false, indexed)
- `created_at`: DateTime (ISO 8601 format, UTC, indexed)
- `updated_at`: DateTime (ISO 8601 format, UTC)

**Constraints**:
- Title is required and must be 1-200 characters
- Description is optional and max 1000 characters
- completed defaults to false
- user_id must reference a valid User
- All database queries must filter by user_id for data isolation

**Indexes**:
- Primary key on `id`
- Index on `user_id` (critical for performance)
- Index on `completed` (for filtering)
- Index on `created_at` (for sorting)

**Relationships**:
- Many Tasks belong to One User (Task.user_id references User.id)

## State Transitions

### Task Completion States
- `completed: false` → `completed: true` (when user marks task complete)
- `completed: true` → `completed: false` (when user marks task incomplete)

**Validation Rules**:
- Only the task owner (authenticated user with matching user_id) can modify completion status
- Updated timestamp is automatically updated on any change

## Validation Rules

### User Validation
- Email format: Must contain @ and valid domain structure
- Password: Minimum 8 characters, hashed with bcrypt before storage
- Email uniqueness: Prevents duplicate account creation

### Task Validation
- Title: 1-200 characters (inclusive)
- Description: 0-1000 characters (inclusive, optional)
- User ownership: Tasks can only be accessed/modified by the owning user
- Required fields: title is mandatory

## Database Schema

### SQLModel Implementation

```python
# User Model
class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(sa_column=Column(String(255), unique=True, index=True, nullable=False))
    password_hash: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationship
    tasks: List["Task"] = Relationship(back_populates="user")

# Task Model
class Task(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id", index=True, nullable=False)
    title: str = Field(sa_column=Column(String, nullable=False))
    description: Optional[str] = Field(sa_column=Column(String, nullable=True))
    completed: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationship
    user: User = Relationship(back_populates="tasks")
```

## Indexing Strategy

### Critical Indexes for Performance
1. `User.email` - For authentication lookups
2. `Task.user_id` - For user data isolation queries
3. `Task.completed` - For filtering completed/incomplete tasks
4. `Task.created_at` - For sorting by creation date
5. `User.created_at` - For user management queries

## Migration Strategy

### From Phase I (if applicable)
- Add `user_id`, `created_at`, `updated_at` fields to existing task table
- Add `email`, `password_hash`, `created_at`, `updated_at` to user table
- Create users table if not exists
- Populate user_id for existing tasks (assign to admin user or migrate appropriately)
- Add necessary indexes

## Security Considerations

### Data Isolation
- ALL database queries must filter by `user_id`
- No cross-user data access allowed
- Foreign key constraints enforce referential integrity
- Index on user_id enables efficient filtering

### Authentication Integration
- User credentials stored securely (bcrypt hashing)
- No plaintext passwords in database
- Session management handled by Better Auth/JWT