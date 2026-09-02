"""
Test settings.

An in-memory SQLite database keeps the test suite fast and hermetic, independent
of any local PostgreSQL configuration.
"""
from .base import *  # noqa: F401,F403
from .base import env_bool

DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Throttling would accumulate across the whole test session against the shared
# locmem cache and flake unrelated tests. Keep the throttle scopes effectively
# unlimited here; a dedicated throttle test overrides it with override_settings.
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES']['google_login'] = '100000/hour'
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES']['auth_action'] = '100000/hour'
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES']['assessment_submit'] = '100000/hour'