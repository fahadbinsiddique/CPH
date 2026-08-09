"""Tests for the consultant creation / join-as-therapist flows."""
import pytest
from rest_framework import status

from cph_app.models import User
from consultants.models import Consultant, Specialization


def _create_specialization(name='Anxiety', slug=None):
    return Specialization.objects.create(
        name=name, slug=slug or name.lower()
    )


def _create_user(email, **kwargs):
    defaults = {
        'username': email,
        'email': email,
        'password': 'pw12345',
        'full_name': 'Test User',
    }
    defaults.update(kwargs)
    return User.objects.create_user(**defaults)


# ---------------------------------------------------------------------------
# Public self-registration flow  (POST /api/consultants/create/)
# ---------------------------------------------------------------------------

@pytest.mark.django_db
def test_public_consultant_create_returns_201(api_client):
    spec = _create_specialization()

    resp = api_client.post('/api/consultants/create/', {
        'email': 'therapist@example.com',
        'password': 'secret123',
        'full_name': 'Jane Smith',
        'bio': 'Licensed clinical psychologist with eight years of experience.',
        'experience_years': 8,
        'consultation_fee': 1500,
        'location': 'Dhaka',
        'languages': 'Bangla, English',
        'specializations': [spec.id],
    }, format='multipart')

    assert resp.status_code == status.HTTP_201_CREATED
    assert resp.data['message']

    user = User.objects.get(email='therapist@example.com')
    assert user.role == 'consultant'
    assert user.username == 'therapist@example.com'

    consultant = Consultant.objects.get(user=user)
    assert consultant.is_verified is False
    assert consultant.is_available is True
    assert consultant.experience_years == 8
    assert list(consultant.specializations.values_list('id', flat=True)) == [spec.id]


@pytest.mark.django_db
def test_public_consultant_create_duplicate_email_400(api_client):
    _create_user('therapist@example.com')
    spec = _create_specialization()

    resp = api_client.post('/api/consultants/create/', {
        'email': 'therapist@example.com',
        'password': 'secret123',
        'full_name': 'Jane Smith',
        'bio': 'Licensed clinical psychologist with eight years of experience.',
        'specializations': [spec.id],
    }, format='multipart')

    assert resp.status_code == status.HTTP_400_BAD_REQUEST
    assert 'email' in resp.data


@pytest.mark.django_db
def test_public_consultant_create_requires_specialization(api_client):
    resp = api_client.post('/api/consultants/create/', {
        'email': 'nobody@example.com',
        'password': 'secret123',
        'full_name': 'Jane Smith',
        'bio': 'Licensed clinical psychologist with eight years of experience.',
        'specializations': [],
    }, format='multipart')

    assert resp.status_code == status.HTTP_400_BAD_REQUEST
    assert 'specializations' in resp.data
    assert not User.objects.filter(email='nobody@example.com').exists()


# ---------------------------------------------------------------------------
# Specialization slugs (category admin)
# ---------------------------------------------------------------------------

@pytest.mark.django_db
def test_specialization_duplicate_name_gets_unique_slug(api_client):
    admin = _create_user('admin@cph.local', role='admin')
    api_client.force_authenticate(user=admin)

    first = api_client.post(
        '/api/consultants/admin/specializations/', {'name': 'Anxiety'}
    )
    second = api_client.post(
        '/api/consultants/admin/specializations/', {'name': 'Anxiety'}
    )

    assert first.status_code == status.HTTP_201_CREATED
    assert second.status_code == status.HTTP_201_CREATED
    assert first.data['slug'] == 'anxiety'
    assert second.data['slug'] == 'anxiety-1'
    assert Specialization.objects.count() == 2


@pytest.mark.django_db
def test_specialization_update_avoids_slug_collision(api_client):
    admin = _create_user('admin@cph.local', role='admin')
    api_client.force_authenticate(user=admin)

    spec = Specialization.objects.create(name='Anxiety', slug='anxiety')
    Specialization.objects.create(name='Stress', slug='stress')

    resp = api_client.patch(
        f'/api/consultants/admin/specializations/{spec.id}/',
        {'name': 'Stress'},
    )

    assert resp.status_code == status.HTTP_200_OK
    assert resp.data['slug'] == 'stress-1'
    spec.refresh_from_db()
    assert spec.slug == 'stress-1'


@pytest.mark.django_db
def test_specialization_create_handles_empty_slug_name(api_client):
    admin = _create_user('admin@cph.local', role='admin')
    api_client.force_authenticate(user=admin)

    resp = api_client.post(
        '/api/consultants/admin/specializations/', {'name': '!!'}
    )

    assert resp.status_code == status.HTTP_201_CREATED
    assert resp.data['slug']  # non-empty fallback slug


# ---------------------------------------------------------------------------
# Authenticated "become a consultant" flow  (POST /api/consultants/me/)
# ---------------------------------------------------------------------------

@pytest.mark.django_db
def test_me_get_reports_no_profile(api_client):
    user = _create_user('client@cph.local')
    api_client.force_authenticate(user=user)

    resp = api_client.get('/api/consultants/me/')

    assert resp.status_code == status.HTTP_200_OK
    assert resp.data['has_profile'] is False
    assert resp.data['data'] is None


@pytest.mark.django_db
def test_me_upgrades_client_to_consultant(api_client):
    user = _create_user('client@cph.local')
    spec = _create_specialization()
    api_client.force_authenticate(user=user)

    resp = api_client.post('/api/consultants/me/', {
        'bio': 'Experienced clinical psychologist.',
        'experience_years': 5,
        'consultation_fee': 1200,
        'location': 'Dhaka',
        'languages': 'English',
        'specializations': [spec.id],
    }, format='multipart')

    assert resp.status_code == status.HTTP_201_CREATED
    user.refresh_from_db()
    assert user.role == 'consultant'

    consultant = Consultant.objects.get(user=user)
    assert consultant.is_verified is False
    assert consultant.experience_years == 5
    assert list(consultant.specializations.values_list('id', flat=True)) == [spec.id]


@pytest.mark.django_db
def test_me_does_not_create_second_profile(api_client):
    user = _create_user('client@cph.local')
    api_client.force_authenticate(user=user)

    api_client.post('/api/consultants/me/', {
        'bio': 'First application bio that is long enough.',
        'experience_years': 3,
    }, format='multipart')
    second = api_client.post('/api/consultants/me/', {
        'bio': 'Updated application bio that is long enough.',
        'experience_years': 4,
    }, format='multipart')

    assert second.status_code == status.HTTP_200_OK
    assert Consultant.objects.filter(user=user).count() == 1
    consultant = Consultant.objects.get(user=user)
    assert consultant.bio == 'Updated application bio that is long enough.'
    assert consultant.experience_years == 4


@pytest.mark.django_db
def test_me_keeps_existing_consultant_role(api_client):
    user = _create_user('cons@cph.local', role='consultant')
    Consultant.objects.create(user=user, bio='Existing bio that is long enough.')
    api_client.force_authenticate(user=user)

    resp = api_client.post(
        '/api/consultants/me/', {'languages': 'Bangla'}, format='multipart'
    )

    assert resp.status_code == status.HTTP_200_OK
    user.refresh_from_db()
    assert user.role == 'consultant'
    consultant = Consultant.objects.get(user=user)
    assert consultant.languages == 'Bangla'
    assert consultant.bio == 'Existing bio that is long enough.'


@pytest.mark.django_db
def test_me_requires_authentication(api_client):
    resp = api_client.get('/api/consultants/me/')

    assert resp.status_code == status.HTTP_401_UNAUTHORIZED