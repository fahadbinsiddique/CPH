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
    
    path('register/', RegisterView.as_view(),name='RegisterView'),
    path('login/',LoginView.as_view(),name="LoginView"),
    path('logout/',LogoutView.as_view(),name="LogoutView"),
    path('refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),

    
]