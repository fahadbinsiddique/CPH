from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('consultant', 'Consultant'),
        ('admin', 'Admin'),
    )

    full_name = models.CharField(max_length=255, null=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True, blank=True) 
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    created_at = models.DateTimeField(auto_now_add=True)

    # username= 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] # সুপারইউজার তৈরি
    
    

    def __str__(self):
        return self.email