"""
Settings package.

The active settings module is chosen via the DJANGO_SETTINGS_MODULE env var.
`manage.py`, `wsgi.py` and `asgi.py` default this to `config.settings.dev`, so a
normal `python manage.py runserver` just works with zero configuration.
"""
import os

# Lazy default so `runserver` works out of the box, but production deploys can
# explicitly set DJANGO_SETTINGS_MODULE=config.settings.prod.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')