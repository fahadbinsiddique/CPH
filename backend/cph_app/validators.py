import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class StrongPasswordValidator:
    """
    Validate that the password contains at least:
    - 8 characters
    - one letter (a-z, A-Z)
    - one digit (0-9)
    - one special character
    """

    SPECIAL_CHARS = r"[@$!%*#?&^~\-_=+\[\]{}|;:'\",.<>\/\\`]"

    def validate(self, password, user=None):
        if len(password) < 8:
            raise ValidationError(
                _("Password must be at least 8 characters long."),
                code="password_too_short",
            )
        if not re.search(r"[A-Za-z]", password):
            raise ValidationError(
                _("Password must contain at least one letter."),
                code="password_no_letter",
            )
        if not re.search(r"\d", password):
            raise ValidationError(
                _("Password must contain at least one number."),
                code="password_no_digit",
            )
        if not re.search(self.SPECIAL_CHARS, password):
            raise ValidationError(
                _("Password must contain at least one special character."),
                code="password_no_special",
            )

    def get_help_text(self):
        return _(
            "Your password must contain at least 8 characters, "
            "including one letter, one number, and one special character."
        )
