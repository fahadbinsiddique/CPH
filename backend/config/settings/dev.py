"""
Development settings.

Used for local / docker-compose development. Debug is on, the database may fall
back to SQLite when no PostgreSQL connection is configured, and cookies are
allowed over plain HTTP on localhost.
"""
import os

from .base import *  # noqa: F401,F403
from .base import SIMPLE_JWT, env_bool
from core.db import database_config

DEBUG = env_bool('DEBUG', default=True)

# Local development only: allow the Docker/Next.js client on any localhost port.
ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv('ALLOWED_HOSTS', '*').split(',')
    if host.strip()
]

# Local PostgreSQL (docker-compose) or fall back to SQLite for zero-config dev.
# DB_SSL_REQUIRE can force SSL on for managed databases (e.g. Supabase) when set.
DATABASES = {
    'default': database_config(
        ssl_require=env_bool('DB_SSL_REQUIRE', default=False),
        default_host=os.getenv('DB_HOST', 'db'),
    ),
}

# Allow the frontend dev server (localhost:3000 / any port) to call the API.
CORS_ALLOWED_ORIGIN_REGEXES = [
    r'^https://.*\.vercel\.app$',
    r'^http://localhost:\d+$',
]

# JWT/HttpOnly cookies must be readable over plain HTTP on localhost.
SIMPLE_JWT['AUTH_COOKIE_SECURE'] = False