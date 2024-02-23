from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

from django.contrib.auth.models import User
from ExamModule.models import Exam


# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    school_year = models.PositiveIntegerField(null=True, blank=True, validators=[
        MaxValueValidator(12),
        MinValueValidator(1)
    ])
    school_name = models.CharField(max_length=128, null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
