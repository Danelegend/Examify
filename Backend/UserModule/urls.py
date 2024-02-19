from django.urls import path

from UserModule import views

# Create your views here.
urlpatterns = [
    path('login', views.LoginEndpoint),
    path('register', views.RegisterEndpoint),
]