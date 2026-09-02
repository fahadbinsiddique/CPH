"""
Custom DRF exception handler.

Wraps all error responses in a consistent envelope:
{
  "success": false,
  "errors": { ... }
}
"""
import logging

from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """Wrap DRF exception responses in a standardised error envelope."""
    response = exception_handler(exc, context)

    if response is not None:
        logger.warning(
            'API error %s -> %s: %s',
            context.get('request').path if context.get('request') else 'unknown',
            getattr(response, 'status_code', None),
            getattr(response, 'data', None),
        )

        # Normalise the data into {"errors": ...} format.
        data = response.data
        if isinstance(data, dict) and 'errors' not in data:
            # DRF returns {"field": ["error"]} or {"detail": "error"}.
            # Wrap it so the frontend always reads response.data.errors.
            response.data = {'success': False, 'errors': data}
        elif isinstance(data, list):
            response.data = {'success': False, 'errors': {'detail': data}}

    return response