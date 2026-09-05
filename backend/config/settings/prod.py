"""
Production settings.

Debug is off, the database requires SSL when using a connection string, and all
security flags are enabled. Every value that differs between environments is
read from the environment / backend/.env file.
"""
import os

from .base import *  # noqa: F401,F403
from .base import SIMPLE_JWT, env_bool
from core.db import database_config

DEBUG = False  # Enforced False in production — never read from env

# Comma-separated list, e.g. "api.yourdomain.com,www.yourdomain.com".
ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        'ALLOWED_HOSTS', 'localhost,127.0.0.1,.onrender.com'
    ).split(',')
    if host.strip()
]

# Production database: prefer the connection string with SSL required, fall back
# to individual DB_* parameters. ssl_require can be forced with DB_SSL_REQUIRE.
DATABASES = {
    'default': database_config(
        ssl_require=os.getenv('DB_SSL_REQUIRE', 'True').lower()
        in ('1', 'true', 'yes', 'on'),
    ),
}

# Only explicitly listed production origins may talk to the API.
CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        'CORS_ALLOWED_ORIGINS',
        'https://fahadcph.vercel.app,https://centreforpsychologicalhealth.com',
    ).split(',')
    if origin.strip()
]

# CSRF trust for the frontend origin(s).
CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        'CSRF_TRUSTED_ORIGINS',
        'https://fahadcph.vercel.app,https://centreforpsychologicalhealth.com',
    ).split(',')
    if origin.strip()
]

# Secure cookies + HTTPS redirect in production.
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# HSTS settings
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Content type nosniff
SECURE_CONTENT_TYPE_NOSNIFF = True

# Cross-origin cookie settings (frontend & backend on different domains)
SIMPLE_JWT['AUTH_COOKIE_SECURE'] = True
SIMPLE_JWT['AUTH_COOKIE_SAMESITE'] = 'Lax'