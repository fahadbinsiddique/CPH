"""Fallback-safe database configuration resolver."""
import os
from pathlib import Path

import dj_database_url

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent


def env_bool(key: str, default: bool = False) -> bool:
    """Parse a truthy environment variable (``true``/``1``/``yes``/``on``)."""
    return os.getenv(key, str(default)).lower() in ('1', 'true', 'yes', 'on')


def database_config(*, ssl_require=None, default_host='localhost'):
    """
    Resolve the Django DATABASES ``default`` entry with safe fallbacks.

    Resolution order:
      1. ``DATABASE_URL``              -> full connection string
         (Supabase / Railway / Heroku style). SSL is required by default in
         production and disabled by default in development.
      2. ``DB_NAME`` + ``DB_USER`` etc. -> individual PostgreSQL parameters.
      3. SQLite file                   -> dev-only zero-config fallback so the
         server never crashes on first run without a database.
    """
    database_url = os.getenv('DATABASE_URL')
    db_name = os.getenv('DB_NAME')

    if database_url:
        if ssl_require is None:
            ssl_require = env_bool(
                'DB_SSL_REQUIRE', default=not env_bool('DEBUG', default=True)
            )
        return dj_database_url.config(
            default=database_url,
            conn_max_age=600,
            ssl_require=ssl_require,
        )

    if db_name:
        return {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': db_name,
            'USER': os.getenv('DB_USER', 'postgres'),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', default_host),
            'PORT': os.getenv('DB_PORT', '5432'),
            'CONN_MAX_AGE': 600,
        }

    return {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': PROJECT_ROOT / 'db.sqlite3',
    }