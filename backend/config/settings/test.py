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