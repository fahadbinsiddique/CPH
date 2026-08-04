"""
Custom DRF exception handler.

The frontend reads DRF's default error payload directly (e.g. ``error?.error``
or iterating the response keys), so we intentionally forward the default
handler's output unchanged. This module exists as the single extension point for
global error handling / logging without touching every view.
"""
import logging

from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """Pass-through DRF exception handler with centralised logging."""
    response = exception_handler(exc, context)

    if response is not None:
        logger.warning(
            'API error %s -> %s: %s',
            context.get('request').path if context.get('request') else 'unknown',
            getattr(response, 'status_code', None),
            getattr(response, 'data', None),
        )

    return response