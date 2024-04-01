from django.http import FileResponse, JsonResponse
from rest_framework.decorators import api_view

from app.functionality.logo.logo import get_logo, get_logos

@api_view(['GET'])
def LogosEndpoint(request):
    return JsonResponse({"logos": get_logos()})

@api_view(['GET'])
def LogoEndpoint(request, logo_id):
    return FileResponse(get_logo(logo_id), content_type='image/png', status=200)