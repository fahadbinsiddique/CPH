from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField

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
    REQUIRED_FIELDS = ['username'] # for superuser
    def __str__(self):
        return self.email
    

class StudentInfo(models.Model):
    name=models.CharField(max_length=120,null=True)
    adress=models.CharField(max_length=120,null=True)
    department=models.CharField(max_length=120,null=True)
    phone=models.CharField(max_length=120,null=True)
    photos=CloudinaryField('image')

    @property
    def photo(self):
        if self.photo:
            return f"https://res.cloudinary.com/ds8pqfvld/{self.photos}"
        return None

    def __str__(self):
        return f'{self.name}'
    
