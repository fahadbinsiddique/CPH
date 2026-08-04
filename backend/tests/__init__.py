"""
Generic test infrastructure.

pytest with the ``pytest-django`` plugin, configured in ``backend/pytest.ini``.
Smoke tests that do not require a live database live here; per-app tests remain
in each app's ``tests.py``.
"""