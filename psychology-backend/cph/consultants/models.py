import uuid
from django.utils.text import slugify
from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField


class Specialization(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class Consultant(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='consultant_profile'
    )
    specializations = models.ManyToManyField(Specialization, blank=True)
    bio = models.TextField(blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    profile_image=CloudinaryField('image', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    languages = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    slug = models.SlugField(unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.full_name or self.user.email or "Consultant"

    def save(self, *args, **kwargs):
        if not self.slug:
            # Append a short UUID suffix to the slug to keep it unique.
            base_slug = slugify(self.user.full_name or "consultant")
            unique_suffix = uuid.uuid4().hex[:6]
            self.slug = f"{base_slug}-{unique_suffix}"
        super().save(*args, **kwargs)


class ConsultantAvailability(models.Model):
    DAY_CHOICES = [
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
    ]

    consultation_type_choices = [
        ('online', 'Online'),
        ('offline', 'Offline'),
        ('both', 'Both'),
    ]

    consultant = models.ForeignKey(
        Consultant, on_delete=models.CASCADE,
        related_name='availability'
    )
    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    session_type = models.CharField(max_length=10, choices=consultation_type_choices, default='both')

    class Meta:
        unique_together = ('consultant', 'day')
        ordering = ['day', 'start_time']
        
    def __str__(self):
        return f"{self.consultant} — {self.day}"