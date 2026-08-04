"""
URL configuration for the Center for Psychology Health project.

All feature routes are aggregated under the ``api`` package (``api/urls.py``),
and interactive API documentation is served by ``api/schema.py``.
"""
from django.contrib import admin
from django.urls import include, path

from api.schema import swagger_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
] + swagger_urlpatterns