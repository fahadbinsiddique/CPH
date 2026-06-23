from django.contrib import admin
from consultants.models import *

# Register your models here.
admin.site.register(
    [
        Specialization,
        Consultant,
        ConsultantAvailability,
    ]
)
