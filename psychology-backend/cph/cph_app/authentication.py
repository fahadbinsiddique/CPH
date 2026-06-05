from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # প্রথমে cookie থেকে token নেওয়ার চেষ্টা করো
        access_token = request.COOKIES.get('access_token')

        if access_token is None:
            # Cookie না থাকলে header থেকে নেওয়ার চেষ্টা করো
            return super().authenticate(request)

        try:
            validated_token = AccessToken(access_token)
            user = self.get_user(validated_token)
            return (user, validated_token)
        except (InvalidToken, TokenError):
            return None