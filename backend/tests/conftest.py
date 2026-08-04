"""Shared pytest fixtures (pytest-django)."""
import pytest


@pytest.fixture
def api_client():
    """DRF APIClient configured for the app's cookie-based JWT auth."""
    from rest_framework.test import APIClient

    return APIClient()