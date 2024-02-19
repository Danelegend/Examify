import json
from .Functionality.FilterConfig import FilterConfig
from .Functionality.exam import *
from django.http import FileResponse, HttpResponse

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt 
def ExamsEndpoint(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    next_load = body["load_start"]
    load_size = body["load_size"]
    encoded_filter_config = body["filter_config"]
    sort_method = body["sort"]

    filterConfig = FilterConfig.Decode(encoded_filter_config)

    data = GetExams(filterConfig)

    return HttpResponse(data, content_type='application/json')


def ExamEndpoint(request):
    exam_id = request.GET["id"]

    data = GetExam(exam_id)

    if data is None:
        return HttpResponse("<h1> No exam with ID </h1>")

    return HttpResponse(data, content_type='application/json')


def ExamPdfEndpoint(request):
    location = request.GET["location"]

    try:
        response = FileResponse(GetExamPdf(location), content_type='application/pdf')
    except IOError:
        response = HttpResponse('<h1> File not exist </h1>')
    except ValueError:
        response = HttpResponse('<h1> Unaccessible location </h1>')

    return response


def ExamFavourite(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    user_id = body["user_id"]
    exam_id = body["exam_id"]

    return

