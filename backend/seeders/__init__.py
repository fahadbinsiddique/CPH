"""
Seeders app.

Houses idempotent management commands that populate initial/development data.
Every command here is safe to run repeatedly (uses ``get_or_create``).

Commands
--------
seed_all        Runs every seeder in dependency order (currently
                seed_consultants).
"""