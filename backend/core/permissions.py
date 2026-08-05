"""Reusable DRF permission classes."""
from rest_framework.permissions import BasePermission


class IsRoleAdmin(BasePermission):
    """Allows access only to users whose role is ``admin``."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'role', None) == 'admin'
        )