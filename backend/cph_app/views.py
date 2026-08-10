from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.viewsets import ModelViewSet 
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from config.email_utils import welcome_email

from cph_app.serializers import *


# Helper for authentication cookies.

def set_auth_cookies(response, access_token, refresh_token):
    """
    Set JWT tokens in HttpOnly cookies.
    """

    jwt = settings.SIMPLE_JWT

    response.set_cookie(
        key="access_token",
        value=str(access_token),
        httponly=jwt["AUTH_COOKIE_HTTP_ONLY"],
        secure=jwt["AUTH_COOKIE_SECURE"],
        samesite=jwt["AUTH_COOKIE_SAMESITE"],
        max_age=60 * 60,  # 1 hour
    )

    response.set_cookie(
        key="refresh_token",
        value=str(refresh_token),
        httponly=jwt["AUTH_COOKIE_HTTP_ONLY"],
        secure=jwt["AUTH_COOKIE_SECURE"],
        samesite=jwt["AUTH_COOKIE_SAMESITE"],
        max_age=7 * 24 * 60 * 60,  # 7 days
    )

    return response


def clear_auth_cookies(response):
   

    jwt = settings.SIMPLE_JWT

    # Delete cookies according to the Django cookie configuration.
    response.delete_cookie(
        "access_token", 
        path="/",
        samesite=jwt["AUTH_COOKIE_SAMESITE"],
        # secure=True,
    )
    
    response.delete_cookie(
        "refresh_token", 
        path="/", 
        samesite=jwt["AUTH_COOKIE_SAMESITE"],
        # secure=True,
    )   

    return response


# Register view.

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Create the user.
        user = serializer.save()

        # Generate Tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        welcome_email(user) 
        
        # Response
        response = Response(
            {
                "success": True,
                "message": "Registration successful",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )

        # Set Cookies
        return set_auth_cookies(response, access, refresh)


# Login view.

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        # Generate Tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        # Response
        response = Response(
            {
                "success": True,
                "message": "Login successful",
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )

        # Set Cookies
        return set_auth_cookies(response, access, refresh)


# Logout view.
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response(
            {
                "success": True,
                "message": "Logout successful",
            },
            status=status.HTTP_200_OK,
        )

        try:
            refresh_token = request.COOKIES.get("refresh_token")

            # Blacklist the refresh token.
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

        except (TokenError, Exception) as e:
            # If token blacklisting fails, continue gracefully and clear the browser cookies.
            print(f"Logout token blacklisting skipped/failed: {str(e)}")
            pass

        # Always return a response that clears the auth cookies.
        return clear_auth_cookies(response)


# Refresh access token view.

class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        jwt = settings.SIMPLE_JWT
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {
                    "success": False,
                    "message": "Refresh token not found",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            refresh = RefreshToken(refresh_token)
            access = refresh.access_token

            response = Response(
                {
                    "success": True,
                    "message": "Access token refreshed",
                },
                status=status.HTTP_200_OK,
            )

            response.set_cookie(
                key="access_token",
                value=str(access),
                httponly=jwt["AUTH_COOKIE_HTTP_ONLY"],
                secure=jwt["AUTH_COOKIE_SECURE"],
                samesite=jwt["AUTH_COOKIE_SAMESITE"],
                max_age=60 * 60,
            )

            return response

        except TokenError:
            return Response(
                {
                    "success": False,
                    "message": "Invalid or expired refresh token",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )


# Current logged-in user view.

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserSerializer(request.user)

        return Response(
            {
                "success": True,
                "user": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        data = request.data

        allowed_fields = ['full_name']
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])
        user.save()

        return Response(UserSerializer(user).data)

from core.permissions import IsRoleAdmin
from django.contrib.auth import get_user_model

class AdminUserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsRoleAdmin]

    def get_queryset(self):
        return get_user_model().objects.all().order_by('-created_at')
    
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response(
                {'error': 'Current password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {'error': 'Password must be at least 8 characters.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password updated successfully.'})


from google.oauth2 import id_token
from google.auth.transport import requests


User = get_user_model()

class GoogleOneTapLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Google token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            
            id_info = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )

            email = id_info.get('email')
            first_name = id_info.get('given_name', '')
            last_name = id_info.get('family_name', '')
            full_name = f"{first_name} {last_name}".strip()

            
            user, created = User.objects.get_or_create(email=email, defaults={
                'username': email,
                'first_name': first_name,
                'last_name': last_name,
                'full_name': full_name or email.split('@')[0],
                'is_active': True
            })

            
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            
            response = Response({
                "success": True,
                "message": "Google login successful",
                "user": UserSerializer(user).data,
            }, status=status.HTTP_200_OK)

            
            return set_auth_cookies(response, access, refresh)

        except ValueError:
            return Response({'error': 'Invalid or expired Google token'}, status=status.HTTP_400_BAD_REQUEST)