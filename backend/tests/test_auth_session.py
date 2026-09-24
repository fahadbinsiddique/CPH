"""Session lifecycle: refresh rotation grace and logout cookie hygiene.

Covers the two bugs behind "refresh token present but no access token is ever
minted" and "dashboard survives after logout":
  * concurrent refreshes must not401 each other after rotation (grace window)
  * logout must succeed — and clear cookies — even with an expired/missing
    access token, and must kill rotated successors so they cannot be replayed.
"""
import pytest
from rest_framework_simplejwt.tokens import RefreshToken

from cph_app.models import User


def _create_user(email, **kwargs):
    defaults = {
        'username': email,
        'email': email,
        'password': 'pw12345',
        'full_name': 'Session Test User',
    }
    defaults.update(kwargs)
    return User.objects.create_user(**defaults)


def _set_refresh_cookie(api_client, token):
    api_client.cookies['refresh_token'] = str(token)


@pytest.mark.django_db
def test_refresh_rotates_and_returns_tokens_in_body(api_client):
    user = _create_user('rotate@cph.local')
    original = str(RefreshToken.for_user(user))
    _set_refresh_cookie(api_client, original)

    res = api_client.post('/api/auth/refresh/')

    assert res.status_code == 200
    assert res.data['success'] is True
    assert res.data['access']
    assert res.data['refresh']
    # Rotation actually happened: new refresh differs from the one we sent.
    assert res.data['refresh'] != original


@pytest.mark.django_db
def test_replaying_rotated_token_within_grace_still_succeeds(api_client):
    """A concurrent refresh that loses the rotation race must not401."""
    user = _create_user('grace@cph.local')
    original = str(RefreshToken.for_user(user))

    _set_refresh_cookie(api_client, original)
    first = api_client.post('/api/auth/refresh/')
    assert first.status_code == 200
    successor = first.data['refresh']
    assert successor

    # Replay the ORIGINAL — now blacklisted — exactly as a racing request
    # would. Before the grace window this returned401 and killed the session.
    _set_refresh_cookie(api_client, original)
    second = api_client.post('/api/auth/refresh/')

    assert second.status_code == 200
    assert second.data['success'] is True
    assert second.data['access']
    # The chain must keep working from whatever token the browser ends up with.
    _set_refresh_cookie(api_client, second.data['refresh'])
    third = api_client.post('/api/auth/refresh/')
    assert third.status_code == 200


@pytest.mark.django_db
def test_logout_succeeds_without_access_token_and_clears_cookies(api_client):
    user = _create_user('logout@cph.local')
    refresh = str(RefreshToken.for_user(user))

    # Only the refresh cookie — the common case, since the access token lives
    # for a minute. Before the fix this401'd and the httpOnly cookies stayed.
    _set_refresh_cookie(api_client, refresh)
    res = api_client.post('/api/auth/logout/')

    assert res.status_code == 200
    assert res.cookies['refresh_token'].value == ''
    assert 'access_token' in res.cookies

    # The refresh token must be dead afterwards: no replay via grace window.
    _set_refresh_cookie(api_client, refresh)
    replay = api_client.post('/api/auth/refresh/')
    assert replay.status_code == 401


@pytest.mark.django_db
def test_logout_kills_rotated_successor_and_grace_chain(api_client):
    user = _create_user('logout-rotated@cph.local')
    original = str(RefreshToken.for_user(user))

    # Rotate once so a successor exists in the grace mapping.
    _set_refresh_cookie(api_client, original)
    rotated = api_client.post('/api/auth/refresh/')
    assert rotated.status_code == 200
    successor = rotated.data['refresh']

    # Log out while holding the successor.
    _set_refresh_cookie(api_client, successor)
    res = api_client.post('/api/auth/logout/')
    assert res.status_code == 200

    # Replaying the ORIGINAL must not resurrect the session through the grace
    # chain: the successor is blacklisted and the mapping was dropped.
    _set_refresh_cookie(api_client, original)
    replay = api_client.post('/api/auth/refresh/')
    assert replay.status_code == 401

    # And the successor itself is dead too.
    _set_refresh_cookie(api_client, successor)
    replay2 = api_client.post('/api/auth/refresh/')
    assert replay2.status_code == 401
