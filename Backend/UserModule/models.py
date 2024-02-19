from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

from django.contrib.auth.models import User
from ExamModule.models import Exam


# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    school_year = models.PositiveIntegerField(null=True, validators=[
        MaxValueValidator(12),
        MinValueValidator(1)
    ])
    school_name = models.CharField(max_length=128, null=True)
    date_created = models.DateTimeField(auto_now_add=True)


class UserFavouriteExamRelation(models.Model):
    class Meta:
        unique_together = (('user', 'exam'),)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    date_of_favourite = models.DateTimeField(auto_now_add=True)

