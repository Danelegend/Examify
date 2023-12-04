from .models import Exam
from django.http import FileResponse, HttpResponse
from django.core import serializers

from .exam_types import ExamType

def ExamsEndpoint(request):
    queryset = Exam.objects.all()
    
    for item in queryset:
        item.exam_type = ExamType.MapPrefixToName(item.exam_type)

    data = serializers.serialize('json', queryset, fields=('id', 'school_name', 'exam_type', 'year'))

    return HttpResponse(data, content_type='application/json')

def ExamEndpoint(request):
    file_location = "./exams/Caringbah-2022-4U-Trial.pdf"

    try:
        # sending response 
        response = FileResponse(open(file_location, "rb"), content_type='application/pdf')
    except IOError:
        # handle file not exist case here
        response = HttpResponse('<h1>File not exist</h1>')

    return response

def LookupExamByTitleEndpoint(request):
    # Given an exam title of form {School}-{Type}-{year}, lookup the id
    # Returns -1 on when no exam of that form

    return -1