from django.urls import path

from app.views import user_views

urlpatterns = [
    path('profile', user_views.UserProfileEndpoint),
]