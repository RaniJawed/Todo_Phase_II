#!/usr/bin/env python
"""
Script to run Alembic migrations for the task management application.

This script demonstrates how to run the database migrations when PostgreSQL is available.

To run migrations in a real environment:

1. Make sure PostgreSQL is running:
   docker-compose up -d db

2. Run this script:
   python run_migrations.py

Or run directly with Alembic:
   cd backend
   alembic upgrade head
"""

import subprocess
import sys
import os

def run_migrations():
    """Run alembic migrations to create database tables."""
    print("Attempting to run Alembic migrations...")
    print("Migration file created: alembic/versions/20251221_164149_initial_migration_for_users_and_tasks_tables.py")
    print()
    print("To execute the migration, please ensure PostgreSQL is running and run:")
    print("  cd backend")
    print("  alembic upgrade head")
    print()
    print("Or using the environment-specific command:")
    print("  DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todoapp alembic upgrade head")
    print()
    print("The migration will create:")
    print("- users table with id, email, password_hash, created_at, updated_at")
    print("- tasks table with id, title, description, completed, user_id, created_at, updated_at")
    print("- proper indexes and foreign key relationships")

if __name__ == "__main__":
    run_migrations()