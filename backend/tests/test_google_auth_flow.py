"""Tests for the Google One Tap login flow (POST /api/auth/google/)."""
import pytest
from django.conf import settings
from rest_framework import status

from cph_app.models import User


def _fake_id_info(email='google@example.com', **overrides):
    info = {
        'iss': 'accounts.google.com',
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

    def verify_oauth2_token(token, request, audience):
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
        lambda token, request, audience: _fake_id_info(nonce='other-nonce'),
    )

    response = api_client.post(google_url, {'token': 'x', 'nonce': 'test-nonce-123'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_google_login_rejects_unverified_email(api_client, google_url, monkeypatch):
    import google.oauth2.id_token as id_token

    monkeypatch.setattr(
        id_token,
        'verify_oauth2_token',
        lambda token, request, audience: _fake_id_info(email_verified=False),
    )

    response = api_client.post(google_url, {'token': 'x', 'nonce': 'test-nonce-123'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_google_login_rejects_wrong_audience(api_client, google_url, monkeypatch):
    import google.oauth2.id_token as id_token

    monkeypatch.setattr(
        id_token,
        'verify_oauth2_token',
        lambda token, request, audience: _fake_id_info(aud='some-other-client'),
    )

    response = api_client.post(google_url, {'token': 'x', 'nonce': 'test-nonce-123'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_google_login_rejects_invalid_token(api_client, google_url, monkeypatch):
    import google.oauth2.id_token as id_token

    def raise_invalid(token, request, audience):
        raise ValueError('Bad token')

    monkeypatch.setattr(id_token, 'verify_oauth2_token', raise_invalid)

    response = api_client.post(google_url, {'token': 'bad', 'nonce': 'test-nonce-123'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
