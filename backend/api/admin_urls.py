"""
Admin-only API routes.

Centralises all admin endpoints under /api/admin/ so that sensitive
management operations live in one predictable namespace.
"""
from django.urls import include, path
from cph_app.views import AdminUserListView

urlpatterns = [
    # User management
    path('users/', AdminUserListView.as_view(), name='admin-user-list'),

    # Consultant management
    path('consultants/', include('consultants.admin_urls')),

    # Blog management
    path('blogs/', include('blogs.admin_urls')),

    # Appointment analytics
    path('appointments/', include('appointments.admin_urls')),
]
