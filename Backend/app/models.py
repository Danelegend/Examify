from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import User

from app.types import ExamType, UserType

# Create your models here.
class Sessions(models.Model):
    session_id = models.BigAutoField(primary_key=True)
    refresh_id = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class Schools(models.Model):
    name = models.CharField(max_length=128, primary_key=True)
    logo_location = models.FilePathField(default="")

class Exam(models.Model):
    id = models.BigAutoField(primary_key=True, null=False)
    school = models.ForeignKey(Schools, on_delete=models.SET_DEFAULT, default="")
    exam_type = models.CharField(choices=ExamType.Choices(), max_length=3, null=False)
    year = models.PositiveSmallIntegerField(null=False)
    file_location = models.FilePathField(null=False, unique=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)
    subject = models.CharField(max_length=128, null=False)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    school_year = models.PositiveIntegerField(default=None, null=True, blank=True, validators=[
        MaxValueValidator(12),
        MinValueValidator(1)
    ])
    school = models.ForeignKey(Schools, on_delete=models.SET_NULL, default=None, null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    registration_method = models.CharField(choices=[("email", "Email"), ("google", "Google"), ("facebook", "Facebook")], 
                                            max_length=128,
                                            null=False)
    permissions = models.CharField(choices=UserType.Choices(), max_length=3, null=False, default=UserType.REGULAR.value)
    date_of_birth = models.DateField(default=None, null=True, blank=True)

class FavouriteExam(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)

class RecentlyViewedExam(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)

