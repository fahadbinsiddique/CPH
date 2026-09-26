"""
Base Django settings shared by every environment (development, production, tests).

Environment-specific values (DEBUG, ALLOWED_HOSTS, DATABASE, CORS, cookie
security) live in the `dev.py`, `prod.py` and `test.py` modules of this package.
"""
import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

from core.db import database_config, env_bool

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# backend/config/settings/base.py -> backend/
BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / '.env')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv(
    'SECRET_KEY',
    'django-insecure-CHANGE-ME-in-your-backend-.env-file-for-production',
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env_bool('DEBUG', default=True)

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
    if host.strip()
]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'cloudinary_storage',
    'cloudinary',
    'django_filters',
    'drf_spectacular',

    # Local apps
    'cph_app',
    'consultants',
    'appointments',
    'blogs',
    'assessments',
    'seeders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# DB config order: DATABASE_URL -> DB_* -> SQLite (dev fallback). Env-specific overrides in dev.py/prod.py/test.py.
DATABASES = {
    'default': database_config(),
}

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'cph_app.authentication.CookieJWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ] if not DEBUG else [
        'rest_framework.renderers.BrowsableAPIRenderer',
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    # Keep DRF's default exception payload for frontend compatibility.
    'EXCEPTION_HANDLER': 'core.exceptions.custom_exception_handler',
    # Global throttle defaults — every view gets baseline protection.
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    # Public endpoints that mint sessions must be throttled (defense in depth
    # against token-replay / credential abuse).
    'DEFAULT_THROTTLE_RATES': {
        'google_login': os.getenv('THROTTLE_GOOGLE_LOGIN', '10/hour'),
        'auth_action': os.getenv('THROTTLE_AUTH_ACTION', '30/hour'),
        'assessment_submit': os.getenv('THROTTLE_ASSESSMENT_SUBMIT', '20/hour'),
        'refresh_token': os.getenv('THROTTLE_REFRESH_TOKEN', '30/hour'),
        'write_action': os.getenv('THROTTLE_WRITE_ACTION', '60/hour'),
        'anon': os.getenv('THROTTLE_ANON', '100/hour'),
        'user': os.getenv('THROTTLE_USER', '1000/hour'),
    },
}

# drf-spectacular (Swagger/OpenAPI)
SPECTACULAR_SETTINGS = {
    'TITLE': 'Center for Psychology Health API',
    'DESCRIPTION': 'REST API for the Center for Psychology Health platform.',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SWAGGER_UI_SETTINGS': {'deepLinking': True},
}

# JWT Settings
SIMPLE_JWT = {
    # 5 minutes made Next middleware's requestSessionRefresh() fire a blocking
    # refresh round trip (~315ms) ahead of nearly every dashboard navigation.
    # 30 minutes keeps sessions alive long enough that refresh is the
    # exception rather than the default path.
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    # Seconds during which a just-rotated refresh token still resolves to its
    # successor (see cph_app.views.recover_rotated_refresh). Absorbs the race
    # when Next middleware and the axios interceptor refresh concurrently.
    'REFRESH_ROTATION_GRACE': int(os.getenv('REFRESH_ROTATION_GRACE', '60')),
    'AUTH_COOKIE': 'access_token',
    'AUTH_COOKIE_REFRESH': 'refresh_token',
    # Local: False, Production: True (overridden under the `not DEBUG` rule).
    'AUTH_COOKIE_SECURE': not DEBUG,
    
    'AUTH_COOKIE_SAMESITE': 'Lax',
    'AUTH_COOKIE_HTTP_ONLY': True,
}

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        'CSRF_TRUSTED_ORIGINS', 'http://localhost:3000,http://localhost:5173'
    ).split(',')
    if origin.strip()
]

# CORS
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
]
CORS_ALLOW_HEADERS = [
    'content-type',
    'authorization',
    'x-requested-with',
    'accept',
]

# Cloudinary
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'),
}

# Password validation
# https://docs.djangoproject.com/en/stable/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
    {'NAME': 'cph_app.validators.StrongPasswordValidator'},
]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Dhaka'

USE_I18N = True

USE_TZ = True

# Static & Media
# Django 6 uses the `STORAGES` setting (replaces DEFAULT_FILE_STORAGE /
# STATICFILES_STORAGE which were deprecated).
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'

STORAGES = {
    'default': {'BACKEND': 'cloudinary_storage.storage.MediaCloudinaryStorage'},
    'staticfiles': {'BACKEND': 'whitenoise.storage.CompressedStaticFilesStorage'},
}

AUTH_USER_MODEL = 'cph_app.User'

# File upload limits (5 MB default)
DATA_UPLOAD_MAX_MEMORY_SIZE = int(os.getenv('DATA_UPLOAD_MAX_MEMORY_SIZE', 5 * 1024 * 1024))
FILE_UPLOAD_MAX_MEMORY_SIZE = int(os.getenv('FILE_UPLOAD_MAX_MEMORY_SIZE', 5 * 1024 * 1024))

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
    },
}