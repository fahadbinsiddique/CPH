from django.db import models
from django.conf import settings
from consultants.models import Consultant


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    SESSION_CHOICES = [
        ('online', 'Online'),
        ('in_person', 'In Person'),
    ]

    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    consultant = models.ForeignKey(
        Consultant,
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    session_type = models.CharField(
        max_length=20, choices=SESSION_CHOICES, default='online'
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending'
    )
    notes = models.TextField(blank=True) # consultants prescription or notes
    client_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('consultant', 'appointment_date', 'appointment_time')

    def __str__(self):
        return f"{self.client} → {self.consultant} | {self.appointment_date}"