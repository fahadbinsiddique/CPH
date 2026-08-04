"""Basic smoke tests that verify the project boots and routes resolve."""
import pytest


@pytest.mark.django_db
def test_public_consultant_list_resolves():
    from django.urls import reverse

    assert reverse('consultant-list') == '/api/consultants/'


@pytest.mark.django_db
def test_auth_routes_resolve():
    from django.urls import reverse

    assert reverse('LoginView') == '/api/auth/login/'
    assert reverse('RegisterView') == '/api/auth/register/'


@pytest.mark.django_db
def test_api_client_reaches_login_endpoint(api_client):
    # Unknown credentials must not 404; they should 400 from validation.
    resp = api_client.post('/api/auth/login/', {'email': '', 'password': ''})
    assert resp.status_code == 400