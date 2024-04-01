from django.http import JsonResponse

from rest_framework.decorators import api_view

@api_view(['GET'])
def UserProfileEndpoint(request):
    return JsonResponse({
        "name": "Dane",
        "exams_completed": 6,
    }, status=200)
