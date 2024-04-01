from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import User

from app.exam_types import ExamType

# Create your models here.
class Sessions(models.Model):
    session_id = models.BigAutoField(primary_key=True)
    refresh_id = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class Exam(models.Model):
    id = models.BigAutoField(primary_key=True, null=False)
    school_name = models.CharField(max_length=128, default="")
    exam_type = models.CharField(choices=ExamType.Choices(), max_length=3, null=False)
    year = models.PositiveSmallIntegerField(null=False)
    file_location = models.FilePathField(null=False, unique=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    school_year = models.PositiveIntegerField(null=True, blank=True, validators=[
        MaxValueValidator(12),
        MinValueValidator(1)
    ])
    school_name = models.CharField(max_length=128, null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    registration_method = models.CharField(choices=[("email", "Email"), ("google", "Google"), ("facebook", "Facebook")], 
                                            max_length=128,
                                              null=False)

class FavouriteExam(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)

class RecentlyViewedExam(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)

