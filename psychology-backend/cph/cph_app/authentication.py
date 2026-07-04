from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # First, try to read the token from the cookie.
        access_token = request.COOKIES.get('access_token')

        if access_token is None:
            # If no cookie is present, fall back to the authorization header.
            return super().authenticate(request)

        try:
            validated_token = AccessToken(access_token)
            user = self.get_user(validated_token)
            return (user, validated_token)
        except (InvalidToken, TokenError) as e:
            # If the cookie exists but is invalid or expired, raise an invalid-token error so the frontend can initiate refresh handling.
            raise InvalidToken(e)