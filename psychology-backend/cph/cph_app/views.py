from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.viewsets import ModelViewSet 
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from cph_app.serializers import *



 
# Cookie Helper
 
def set_auth_cookies(response, access_token, refresh_token):
    """
    Set JWT tokens in HttpOnly cookies
    """

    response.set_cookie(
        key="access_token",
        value=str(access_token),
        httponly=True,
        secure=True,  # Production এ True করবে
        samesite="None",
        max_age=60 * 60,  # 1 hour
    )

    response.set_cookie(
        key="refresh_token",
        value=str(refresh_token),
        httponly=True,
        secure=True,  # Production এ True করবে
        samesite="None",
        max_age=7 * 24 * 60 * 60,  # 7 days
    )

    return response


def clear_auth_cookies(response):
    """
    Remove auth cookies
    """

    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return response


 
# Register View
 
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Create User
        user = serializer.save()

        # Generate Tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

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


 
# Login View
 
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


 
# Logout View
 
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:
            refresh_token = request.COOKIES.get("refresh_token")

            # Blacklist Refresh Token
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            response = Response(
                {
                    "success": True,
                    "message": "Logout successful",
                },
                status=status.HTTP_200_OK,
            )

            return clear_auth_cookies(response)

        except TokenError:
            return Response(
                {
                    "success": False,
                    "message": "Invalid or expired token",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


 
# Refresh Access Token
 
class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

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
                httponly=True,
                secure=True,  # Production এ True করবে
                samesite="None",
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


 
# Current Logged-in User
 
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
