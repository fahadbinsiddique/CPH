from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView,TokenObtainPairView
from cph_app.views import *




urlpatterns = [

    path('register/', RegisterView.as_view(),name='RegisterView'),
    path('login/',LoginView.as_view(),name="LoginView"),
    path('logout/',LogoutView.as_view(),name="LogoutView"),
    path('refresh/', RefreshTokenView.as_view(), name='token_refresh'),

    path('google/', GoogleOneTapLoginView.as_view(), name='google_one_tap_login'),

    path('me/', MeView.as_view(), name='me'),
    path('me/update/', UpdateProfileView.as_view(), name='profile-update'),

    path('users/', AdminUserListView.as_view(), name='admin-user-list'),

    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    
]