"""Tests for strong password validation across registration and password change."""
import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient

from cph_app.validators import StrongPasswordValidator

User = get_user_model()


# ---------------------------------------------------------------------------
# Unit tests for the custom validator
# ---------------------------------------------------------------------------

class TestStrongPasswordValidator:
    def setup_method(self):
        self.validator = StrongPasswordValidator()

    def test_valid_password(self):
        validate_password("Str0ng@Pass")

    def test_too_short(self):
        with pytest.raises(ValidationError, match="at least 8 characters"):
            self.validator.validate("Ab1@")

    def test_no_letter(self):
        with pytest.raises(ValidationError, match="one letter"):
            self.validator.validate("12345678@")

    def test_no_digit(self):
        with pytest.raises(ValidationError, match="one number"):
            self.validator.validate("abcdefgh@")

    def test_no_special_char(self):
        with pytest.raises(ValidationError, match="one special character"):
            self.validator.validate("Abcdefg1")

    def test_help_text(self):
        assert "8 characters" in self.validator.get_help_text()


# ---------------------------------------------------------------------------
# Integration tests: Registration endpoint
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestRegistrationPasswordValidation:
    def setup_method(self):
        self.client = APIClient()
        self.url = "/api/auth/register/"
        self.base_payload = {
            "full_name": "Test User",
            "email": "test@example.com",
            "phone_number": "01712345678",
        }

    def _register(self, password):
        payload = {
            **self.base_payload,
            "password": password,
            "confirm_password": password,
        }
        return self.client.post(self.url, payload, format="json")

    def test_registration_rejects_short_password(self):
        resp = self._register("Ab1@")
        assert resp.status_code == 400

    def test_registration_rejects_no_letter(self):
        resp = self._register("12345678@")
        assert resp.status_code == 400

    def test_registration_rejects_no_digit(self):
        resp = self._register("abcdefgh@")
        assert resp.status_code == 400

    def test_registration_rejects_no_special_char(self):
        resp = self._register("Abcdefg1")
        assert resp.status_code == 400

    def test_registration_accepts_strong_password(self):
        resp = self._register("Str0ng@Pass")
        assert resp.status_code == 201

    def test_registration_rejects_mismatched_passwords(self):
        payload = {
            **self.base_payload,
            "password": "Str0ng@Pass",
            "confirm_password": "Different@1",
        }
        resp = self.client.post(self.url, payload, format="json")
        assert resp.status_code == 400


# ---------------------------------------------------------------------------
# Integration tests: Change password endpoint
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestChangePasswordValidation:
    def setup_method(self):
        self.client = APIClient()
        self.url = "/api/auth/change-password/"
        self.user = User.objects.create_user(
            username="changepw@example.com",
            email="changepw@example.com",
            password="Old@Pass1",
            full_name="Change PW User",
        )
        self.client.force_authenticate(user=self.user)

    def _change(self, new_password):
        return self.client.post(
            self.url,
            {"old_password": "Old@Pass1", "new_password": new_password},
            format="json",
        )

    def test_change_rejects_short_password(self):
        resp = self._change("Ab1@")
        assert resp.status_code == 400

    def test_change_rejects_no_letter(self):
        resp = self._change("12345678@")
        assert resp.status_code == 400

    def test_change_rejects_no_digit(self):
        resp = self._change("abcdefgh@")
        assert resp.status_code == 400

    def test_change_rejects_no_special_char(self):
        resp = self._change("Abcdefg1")
        assert resp.status_code == 400

    def test_change_accepts_strong_password(self):
        resp = self._change("N3w@Passw0rd")
        assert resp.status_code == 200

    def test_change_rejects_wrong_old_password(self):
        resp = self.client.post(
            self.url,
            {"old_password": "WrongOld@1", "new_password": "N3w@Passw0rd"},
            format="json",
        )
        assert resp.status_code == 400
