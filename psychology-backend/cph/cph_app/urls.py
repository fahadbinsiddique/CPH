from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView,TokenObtainPairView
from cph_app.views import *


router = DefaultRouter()

router.register(
    r'student',
    StudentModelViewSet,
    basename='student'
)


urlpatterns = [
    path('', include(router.urls)),
    
    path('auth/register/', RegisterView.as_view(),name='RegisterView'),
    path('auth/login/',LoginView.as_view(),name="LoginView"),

    path('token/',TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('token/refresh/',TokenRefreshView.as_view(),name='token_refresh')
]