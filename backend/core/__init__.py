"""
Shared, framework-agnostic helpers used across the project.

This package holds code that does not belong to any single app:
- db.py            -> fallback-safe database configuration resolver
- exceptions.py    -> DRF exception handler (extension point)
- models.py        -> abstract base model / timestamps
- permissions.py   -> reusable permission classes
"""