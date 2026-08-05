"""Single API router that aggregates every feature app's URLconf."""
from django.urls import include, path

urlpatterns = [
    path('auth/', include('cph_app.urls')),
    path('consultants/', include('consultants.urls')),
    path('appointments/', include('appointments.urls')),
    path('blogs/', include('blogs.urls')),
    path('assessments/', include('assessments.urls')),
]
