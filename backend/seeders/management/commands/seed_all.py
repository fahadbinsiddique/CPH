"""Seed every database table needed for a usable development environment."""
from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Seed all baseline data (idempotent; safe to re-run)."

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING('Seeding baseline data...'))

        call_command('seed_consultants')

        self.stdout.write(self.style.SUCCESS('Done. All baseline data seeded.'))