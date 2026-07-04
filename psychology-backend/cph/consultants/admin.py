from django.contrib import admin
from consultants.models import *

admin.site.register(
    [
        Specialization,
        Consultant,
        ConsultantAvailability,
    ]
)
