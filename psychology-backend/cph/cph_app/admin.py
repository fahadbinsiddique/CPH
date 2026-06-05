from django.contrib import admin
from cph_app.models import *
from consultants.models import *

# Register your models here.
admin.site.register([
    User,

    Specialization,
    Consultant,
    ConsultantAvailability,

])