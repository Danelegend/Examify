import json

from django.http import JsonResponse

from rest_framework.decorators import api_view

from app.errors import AuthenticationError
from app.functionality.exams.FilterConfig import FilterConfig
from app.functionality.exams.exams import GetExams, GetFavouriteExams, GetPopularSchools, GetRecentlyViewedExams
from app.views.util import get_access_token

@api_view(['POST'])
def ExamsEndpoint(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    next_load = 0
    load_size = 20
    encoded_filter_config = ""
    sort_method = "Standard"

    filterConfig = FilterConfig.Decode(encoded_filter_config)

    token = get_access_token(request)

    try: 
        data = GetExams(token, filterConfig)

        return JsonResponse(data, status=200)
    except Exception as e:
        print(e)
        return JsonResponse({"message": "Invalid access token"}, status=403)
    
@api_view(['GET'])
def ExamsFavouritesEndpoint(request):
    try:
        exams = GetFavouriteExams(get_access_token(request))

        return JsonResponse({
            "exams": exams
        }, status=200)
    except AuthenticationError as a:
        return JsonResponse({
            "message": a.message
        }, status=403) 

@api_view(['GET'])
def ExamsRecentEndpoint(request):
    token = get_access_token(request)

    try:
        exams = GetRecentlyViewedExams(token)
        
        return JsonResponse({
            "exams": exams
        }, status=200)
    except AuthenticationError as a:
        return JsonResponse({
            "message": a.message
        }, status=403)

@api_view(['GET'])
def ExamsSchoolsEndpoint(request):
    return JsonResponse({
        "schools": GetPopularSchools(10)
    }, status=200)

@api_view(['GET'])
def ExamsSubjectsEndpoint(request):
    return JsonResponse({
        "subjects": [
            "Maths Extension 2",
            "Maths Extension 1",
            "Maths Advanced",
            "Maths Standard 2",
            "Chemistry",
            "Physics",
            "Biology",	
        ]
    }, status=200)