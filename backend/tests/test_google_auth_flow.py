"""Tests for the Google One Tap login flow (POST /api/auth/google/)."""
import pytest
from django.conf import settings
from django.test import override_settings
from rest_framework import status

from cph_app.models import User


def _fake_id_info(email='google@example.com', **overrides):
    info = {
        'iss': 'accounts.google.com',
        'sub': 'google-user-123',
        'aud': settings.GOOGLE_CLIENT_ID,
        'email': email,
        'email_verified': True,
        'given_name': 'Jane',
        'family_name': 'Doe',
        'nonce': 'test-nonce-123',
    }
    info.update(overrides)
    return info


@pytest.fixture(autouse=True)
def _mock_google(monkeypatch):
    """Mock Google token verification for every test in this module."""
    import google.oauth2.id_token as id_token

    def verify_oauth2_token(token, request, audience, **kwargs):
        # **kwargs swallows extras the view passes (e.g. clock_skew_in_seconds).
        return _fake_id_info()

    monkeypatch.setattr(id_token, 'verify_oauth2_token', verify_oauth2_token)


@pytest.fixture
def google_url():
    return '/api/auth/google/'


@pytest.mark.django_db
def test_google_login_creates_user_and_sets_cookies(api_client, google_url):
    response = api_client.post(google_url, {'token': 'x', 'nonce': 'test-nonce-123'})

    assert response.status_code == status.HTTP_200_OK
    assert response.data['success'] is True

    user = User.objects.get(email='google@example.com')
    assert user.full_name == 'Jane Doe'
    assert user.is_active is True
    assert user.google_sub == 'google-user-123'

    assert response.cookies['access_token'].value
    assert response.cookies['refresh_token'].value


@pytest.mark.django_db
def test_google_login_returns_existing_user_without_duplicate(api_client, google_url):
    User.objects.create_user(
        username='google@example.com',
        email='google@example.com',
        password='pw12345',
        full_name='Jane Doe',
    )

    response = api_client.post(google_url, {'token': 'x', 'nonce': 'test-nonce-123'})

    assert response.status_code == status.HTTP_200_OK
    assert User.objects.filter(email='google@example.com').count() == 1


@pytest.mark.django_db
def test_google_login_rejects_missing_token(api_client, google_url):
    response = api_client.post(google_url, {'nonce': 'test-nonce-123'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_google_login_rejects_missing_nonce(api_client, google_url):
    response = api_client.post(google_url, {'token': 'x'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_google_login_rejects_non_matching_nonce(api_client, google_url, monkeypatch):
    import google.oauth2.id_token as id_token

    monkeypatch.setattr(
        id_token,
        'verify_oauth2_token',
        lambda token, request, audience, **kwargs: _fake_id_info(nonce='other-nonce'),
    )

    response = api_client.post(google_url, {'token': 'x', 'nonce': 'test-nonce-123'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_google_login_rejects_unverified_email(api_client, google_url, monkeypatch):
    import google.oauth2.id_token as id_token

    monkeypatch.setattr(
        id_token,
        'verify_oauth2_token',
        lambda token, request, audience, **kwargs: _fake_id_info(email_verified=False),
    )

    response = api_client.post(google_url, {'token': 'x', 'nonce': 'test-nonce-123'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_google_login_rejects_wrong_audience(api_client, google_url, monkeypatch):
    import google.oauth2.id_token as id_token

    monkeypatch.setattr(
        id_token,
        'verify_oauth2_token',
        lambda token, request, audience, **kwargs: _fake_id_info(aud='some-other-client'),
    )

    response = api_client.post(google_url, {'token': 'x', 'nonce': 'test-nonce-123'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_google_login_rejects_invalid_token(api_client, google_url, monkeypatch):
    import google.oauth2.id_token as id_token

    def raise_invalid(token, request, audience, **kwargs):
        raise ValueError('Bad token')

    monkeypatch.setattr(id_token, 'verify_oauth2_token', raise_invalid)

    response = api_client.post(google_url, {'token': 'bad', 'nonce': 'test-nonce-123'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_google_login_handles_network_error(api_client, google_url, monkeypatch):
    """A Google transport failure must not surface as a 500."""
    import google.oauth2.id_token as id_token
    from google.auth.exceptions import TransportError

    def raise_transport(token, request, audience, **kwargs):
        raise TransportError('Google unreachable')

    monkeypatch.setattr(id_token, 'verify_oauth2_token', raise_transport)

    response = api_client.post(google_url, {'token': 'x', 'nonce': 'test-nonce-123'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_google_login_links_by_google_sub_when_email_changed(api_client, google_url, monkeypatch):
    """Returning users are matched by the stable Google id, not the email."""
    User.objects.create(
        username='oldemail@example.com',
        email='oldemail@example.com',
        google_sub='google-user-123',
        is_active=True,
    )

    monkeypatch.setattr(
        'google.oauth2.id_token.verify_oauth2_token',
        lambda token, request, audience, **kwargs: _fake_id_info(email='newemail@example.com'),
    )

    response = api_client.post(google_url, {'token': 'x', 'nonce': 'test-nonce-123'})

    assert response.status_code == status.HTTP_200_OK
    assert User.objects.count() == 1
    assert User.objects.get(google_sub='google-user-123').email == 'oldemail@example.com'


@pytest.mark.django_db
def test_google_login_links_google_sub_on_existing_email(api_client, google_url):
    """Matching by email back-fills the stable Google id for pre-sub accounts."""
    User.objects.create_user(
        username='google@example.com',
        email='google@example.com',
        password='pw12345',
        full_name='Jane Doe',
    )

    response = api_client.post(google_url, {'token': 'x', 'nonce': 'test-nonce-123'})

    assert response.status_code == status.HTTP_200_OK
    user = User.objects.get(email='google@example.com')
    assert user.google_sub == 'google-user-123'


@pytest.mark.django_db
def test_google_login_long_email_username_is_truncated(api_client, google_url, monkeypatch):
    """Django usernames cap at 150 chars; emails can exceed that."""
    long_email = 'a' * 200 + '@example.com'

    monkeypatch.setattr(
        'google.oauth2.id_token.verify_oauth2_token',
        lambda token, request, audience, **kwargs: _fake_id_info(email=long_email),
    )

    response = api_client.post(google_url, {'token': 'x', 'nonce': 'test-nonce-123'})

    assert response.status_code == status.HTTP_200_OK
    user = User.objects.get(email=long_email)
    assert len(user.username) <= 150


@pytest.mark.django_db
@override_settings(REST_FRAMEWORK={
    **settings.REST_FRAMEWORK,
    'DEFAULT_THROTTLE_RATES': {
        **settings.REST_FRAMEWORK.get('DEFAULT_THROTTLE_RATES', {}),
        'google_login': '2/minute',
    },
})
def test_google_login_is_throttled(google_url, settings):
    """The endpoint rate-limits verbose token-replay attempts."""
    from django.core.cache import cache
    from rest_framework.test import APIClient

    cache.clear()

    # Use a fresh client per attempt: the first response sets auth cookies, and
    # AnonRateThrottle intentionally skips authenticated requests (a persistent
    # client would look logged-in for attempts 2 and 3).
    for _ in range(2):
        response = APIClient().post(google_url, {'token': 'x', 'nonce': 'test-nonce-123'})
        assert response.status_code == status.HTTP_200_OK

    throttled = APIClient().post(google_url, {'token': 'x', 'nonce': 'test-nonce-123'})
    assert throttled.status_code == status.HTTP_429_TOO_MANY_REQUESTS


def test_frontend_and_backend_google_client_ids_match():
    """The #1 silent production failure is a client/server client ID mismatch.

    The frontend (NEXT_PUBLIC_GOOGLE_CLIENT_ID) and backend (GOOGLE_CLIENT_ID)
    must be identical, otherwise the One Tap credential is rejected server-side
    with an audience error. Skips when the frontend env file is absent.
    """
    import os
    from pathlib import Path

    frontend_env = (
        Path(__file__).resolve().parent.parent.parent / 'frontend' / '.env.local'
    )
    if not frontend_env.exists():
        pytest.skip('frontend/.env.local not present')

    backend_client_id = settings.GOOGLE_CLIENT_ID
    assert backend_client_id, 'backend GOOGLE_CLIENT_ID is not configured'

    frontend_client_id = None
    for line in frontend_env.read_text(encoding='utf-8').splitlines():
        line = line.strip()
        if line.startswith('NEXT_PUBLIC_GOOGLE_CLIENT_ID='):
            frontend_client_id = line.split('=', 1)[1].strip().strip('"').strip("'")
            break

    if not frontend_client_id:
        pytest.skip('NEXT_PUBLIC_GOOGLE_CLIENT_ID not present in frontend/.env.local')

    assert frontend_client_id == backend_client_id, (
        'Google client ID mismatch: frontend NEXT_PUBLIC_GOOGLE_CLIENT_ID '
        f'({frontend_client_id}) != backend GOOGLE_CLIENT_ID ({backend_client_id})'
    )
