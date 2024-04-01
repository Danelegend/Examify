from django.urls import path

from app.views import logo_views

urlpatterns = [
    path('', logo_views.LogosEndpoint),
    path('<str:logo_id>', logo_views.LogoEndpoint)
]