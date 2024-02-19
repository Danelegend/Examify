from rest_framework import serializers

from .Functionality.FilterConfig import FilterConfig
from .models import Exam

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'school_name', 'exam_type', 'year',
                  'file_location', 'date_uploaded']
        