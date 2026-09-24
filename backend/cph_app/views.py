import base64
import json
import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import validate_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.viewsets import ModelViewSet 
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.settings import api_settings as jwt_api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from config.email_utils import welcome_email

from cph_app.authentication import RoleAccessToken
from cph_app.serializers import *

logger = logging.getLogger(__name__)


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
        max_age=int(jwt["ACCESS_TOKEN_LIFETIME"].total_seconds()),
    )

    response.set_cookie(
        key="refresh_token",
        value=str(refresh_token),
        httponly=jwt["AUTH_COOKIE_HTTP_ONLY"],
        secure=jwt["AUTH_COOKIE_SECURE"],
        samesite=jwt["AUTH_COOKIE_SAMESITE"],
        max_age=int(jwt["REFRESH_TOKEN_LIFETIME"].total_seconds()),
    )

    return response


def clear_auth_cookies(response):    
    jwt = settings.SIMPLE_JWT

    response.delete_cookie(
        "access_token", 
        path="/",
        samesite=jwt["AUTH_COOKIE_SAMESITE"],
    )
    
    response.delete_cookie(
        "refresh_token", 
        path="/", 
        samesite=jwt["AUTH_COOKIE_SAMESITE"],
    )   

    return response


# ── Refresh-token rotation grace ────────────────────────────────────────────
# ROTATE_REFRESH_TOKENS + BLACKLIST_AFTER_ROTATION blacklists a refresh token
# the instant it is exchanged. When two requests race (Next middleware and the
# axios interceptor can both refresh at the same moment), the loser presents
# the just-blacklisted token and would get a 401 — killing an otherwise
# healthy session. For SIMPLE_JWT['REFRESH_ROTATION_GRACE'] seconds after a
# rotation we remember which token it rotated into and serve that successor
# idempotently instead.

ROTATION_GRACE_CHAIN_DEPTH = 3


def _rotation_cache_key(jti):
    return f"refresh_rotation:{jti}"


def decode_jwt_unverified(token_str):
    """Decode a JWT payload without verifying the signature.

    Used only to recover the `jti` of a token we already received so it can be
    looked up in the rotation-grace cache. Never use the returned claims for
    authorization decisions — any client can forge them.
    """
    try:
        parts = str(token_str).split(".")
        if len(parts) != 3:
            return None
        payload = parts[1]
        payload += "=" * (-len(payload) % 4)  # tolerate unpadded base64url
        return json.loads(base64.urlsafe_b64decode(payload).decode("utf-8"))
    except (ValueError, TypeError):
        return None


def recover_rotated_refresh(token_str, grace):
    """Return the successor of an already-rotated refresh token, if usable.

    Follows at most ROTATION_GRACE_CHAIN_DEPTH hops so a token whose successor
    has itself been rotated (or blacklisted by logout) still resolves to a
    live token — or to None when the chain is exhausted.
    """
    payload = decode_jwt_unverified(token_str)
    jti = (payload or {}).get("jti")

    for _ in range(ROTATION_GRACE_CHAIN_DEPTH):
        if not jti:
            return None
        successor = cache.get(_rotation_cache_key(jti))
        if not successor:
            return None
        try:
            return RefreshToken(successor)
        except TokenError:
            # Successor itself was rotated/expired/blacklisted — next hop.
            payload = decode_jwt_unverified(successor)
            jti = (payload or {}).get("jti")

    return None


def _user_for_token(token):
    """Resolve the owner of a verified JWT.

    simplejwt tokens expose no `.user` attribute (the old code called
    `refresh.user`, which raised AttributeError → 500 on every refresh); the
    user id lives in USER_ID_CLAIM of the payload instead. Raises TokenError
    so callers answer 401 rather than crashing.
    """
    user_id = token.payload.get(jwt_api_settings.USER_ID_CLAIM)
    if user_id is None:
        raise TokenError("Token has no user claim")
    user_model = get_user_model()
    try:
        return user_model.objects.get(**{jwt_api_settings.USER_ID_FIELD: user_id})
    except user_model.DoesNotExist as exc:
        raise TokenError("Token user no longer exists") from exc


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_action'

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        access = RoleAccessToken.for_user(user)

        welcome_email(user) 
        
        response = Response(
            {
                "success": True,
                "message": "Registration successful",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )

        return set_auth_cookies(response, access, refresh)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_action'

    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access = RoleAccessToken.for_user(user)

        response = Response(
            {
                "success": True,
                "message": "Login successful",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )

        return set_auth_cookies(response, access, refresh)


class LogoutView(APIView):
    # AllowAny: the access token only lives a minute, so logout most often
    # arrives after it has already expired. Requiring authentication here made
    # the backend answer 401, the httpOnly cookies could then never be deleted
    # (JS cannot touch them), and the leftover refresh cookie kept the
    # "logged out" session alive in middleware.
    permission_classes = [AllowAny]

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

            if refresh_token:
                payload = decode_jwt_unverified(refresh_token)
                jti = (payload or {}).get("jti")
                if jti:
                    # If a concurrent refresh already rotated this token,
                    # blacklist its successor too and drop the grace mapping
                    # so neither can be replayed after logout.
                    key = _rotation_cache_key(jti)
                    successor = cache.get(key)
                    if successor:
                        try:
                            RefreshToken(successor).blacklist()
                        except TokenError:
                            pass
                        cache.delete(key)

                token = RefreshToken(refresh_token)
                token.blacklist()

        except (TokenError, Exception) as e:
            # If token blacklisting fails, continue gracefully and clear the browser cookies.
            logger.warning("Logout token blacklisting skipped/failed: %s", e)

        # Always return a response that clears the auth cookies.
        return clear_auth_cookies(response)


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'refresh_token'

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

        grace = int(jwt.get("REFRESH_ROTATION_GRACE", 60))

        try:
            refresh = RefreshToken(refresh_token)
            original_jti = refresh.payload.get("jti")
        except TokenError:
            # The cookie token is already blacklisted — almost always because
            # a concurrent request rotated it moments ago (Next middleware +
            # axios interceptor racing). Recover the successor instead of
            # failing the session.
            payload = decode_jwt_unverified(refresh_token)
            original_jti = (payload or {}).get("jti")
            refresh = recover_rotated_refresh(refresh_token, grace)
            if refresh is None:
                return Response(
                    {
                        "success": False,
                        "message": "Invalid or expired refresh token",
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )

        try:
            user = _user_for_token(refresh)

            # Rotate the refresh token: blacklist the old one and mint a fresh
            # refresh token, honoring ROTATE_REFRESH_TOKENS / BLACKLIST_AFTER_ROTATION.
            if jwt.get('ROTATE_REFRESH_TOKENS', False):
                refresh.blacklist()
                refresh = RefreshToken.for_user(user)
                if original_jti:
                    # Record the rotation so replays of the previous token
                    # within the grace window resolve here instead of 401ing.
                    cache.set(_rotation_cache_key(original_jti), str(refresh), timeout=grace)

            access = RoleAccessToken.for_user(user)

            response = Response(
                {
                    "success": True,
                    "message": "Access token refreshed",
                    "access": str(access),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK,
            )

            response.set_cookie(
                key="access_token",
                value=str(access),
                httponly=jwt["AUTH_COOKIE_HTTP_ONLY"],
                secure=jwt["AUTH_COOKIE_SECURE"],
                samesite=jwt["AUTH_COOKIE_SAMESITE"],
                max_age=int(jwt["ACCESS_TOKEN_LIFETIME"].total_seconds()),
            )

            # Persist the rotated refresh token cookie so the next refresh works.
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=jwt["AUTH_COOKIE_HTTP_ONLY"],
                secure=jwt["AUTH_COOKIE_SECURE"],
                samesite=jwt["AUTH_COOKIE_SAMESITE"],
                max_age=int(jwt["REFRESH_TOKEN_LIFETIME"].total_seconds()),
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
        serializer = UpdateProfileSerializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(UserSerializer(request.user).data)

from core.permissions import IsRoleAdmin
from django.contrib.auth import get_user_model

class AdminUserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsRoleAdmin]

    def get_queryset(self):
        return get_user_model().objects.all().order_by('-created_at')
    
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_action'

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'error': 'Current password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'message': 'Password updated successfully.'})


from google.oauth2 import id_token
from google.auth.transport import requests
from google.auth.exceptions import GoogleAuthError, TransportError
from rest_framework.throttling import AnonRateThrottle
from rest_framework.settings import api_settings


User = get_user_model()

class GoogleRateThrottle(AnonRateThrottle):
    scope = 'google_login'

    def get_rate(self):
        # Read dynamically so override_settings / runtime config changes apply
        # (THROTTLE_RATES on SimpleRateThrottle is snapshotted at import time).
        return api_settings.DEFAULT_THROTTLE_RATES.get(self.scope, '10/hour')


class GoogleOneTapLoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [GoogleRateThrottle]

    def post(self, request):
        token = request.data.get('token')
        nonce = request.data.get('nonce')

        if not token:
            return Response({'error': 'Google token is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not nonce:
            return Response({'error': 'Nonce is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            id_info = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=60,
            )
        except (ValueError, GoogleAuthError, TransportError) as exc:
            logger.warning("Google token verification failed: %s", type(exc).__name__)
            return Response({'error': 'Invalid or expired Google token'}, status=status.HTTP_400_BAD_REQUEST)

        if id_info.get('iss') not in ('accounts.google.com', 'https://accounts.google.com'):
            return Response({'error': 'Invalid token issuer'}, status=status.HTTP_400_BAD_REQUEST)

        if id_info.get('aud') != settings.GOOGLE_CLIENT_ID:
            return Response({'error': 'Invalid token audience'}, status=status.HTTP_400_BAD_REQUEST)

        if id_info.get('nonce') != nonce:
            return Response({'error': 'Nonce mismatch'}, status=status.HTTP_400_BAD_REQUEST)

        if not id_info.get('email'):
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not id_info.get('email_verified'):
            return Response({'error': 'Unverified Google email'}, status=status.HTTP_400_BAD_REQUEST)

        email = id_info.get('email')
        google_sub = id_info.get('sub')
        first_name = id_info.get('given_name', '')
        last_name = id_info.get('family_name', '')
        full_name = f"{first_name} {last_name}".strip() or email.split('@')[0]

        # Match the stable Google user id first (survives email changes), then
        # fall back to email for accounts that registered before the
        # field existed.
        user = None
        if google_sub:
            user = User.objects.filter(google_sub=google_sub).first()
        if user is None:
            user = User.objects.filter(email=email).first()
        if user is None:
            user = User.objects.create(
                email=email,
                username=email[:150],
                google_sub=google_sub,
                first_name=first_name,
                last_name=last_name,
                full_name=full_name,
                is_active=True,
            )
        else:
            # Link the stable Google id when we matched by email only.
            if google_sub and not user.google_sub:
                user.google_sub = google_sub
                user.save(update_fields=['google_sub'])

        refresh = RefreshToken.for_user(user)
        access = RoleAccessToken.for_user(user)

        response = Response({
            "success": True,
            "message": "Google login successful",
            "user": UserSerializer(user).data,
        }, status=status.HTTP_200_OK)

        return set_auth_cookies(response, access, refresh)


from .models import PushSubscription
from .push_notifications import send_push_notification


class SavePushSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PushSubscriptionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        sub, created = PushSubscription.objects.update_or_create(
            user=request.user,
            endpoint=data["endpoint"],
            defaults={
                "p256dh": data["keys"]["p256dh"],
                "auth": data["keys"]["auth"],
            },
        )
        return Response({"status": "saved", "created": created})

    def delete(self, request):
        endpoint = request.data.get("endpoint")
        if endpoint:
            PushSubscription.objects.filter(
                user=request.user, endpoint=endpoint
            ).delete()
        return Response({"status": "deleted"})