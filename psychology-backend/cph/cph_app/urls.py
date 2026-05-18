from django.urls import path, include
from rest_framework.routers import DefaultRouter

from cph_app.views import *


router = DefaultRouter()

router.register(
    r'student',
    StudentModelViewSet,
    basename='student'
)
router.register(
    r'user',
    UserModelViewSet,
    basename='user'
)

urlpatterns = [
    path('', include(router.urls))
]