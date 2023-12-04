from django.db import models

from .exam_types import ExamType


class Exam(models.Model):
    id = models.BigAutoField(primary_key=True, null=False)
    school_name = models.CharField(max_length=128, default="")
    exam_type = models.CharField(choices=ExamType.Choices(), max_length=3, null=False)
    year = models.PositiveSmallIntegerField(null=False)
    file_location = models.FilePathField(null=False, unique=True)
    date_uploaded = models.DateTimeField(auto_now_add=True)
