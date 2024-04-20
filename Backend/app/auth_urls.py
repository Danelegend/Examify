from django.urls import path

from app.views import auth_views

urlpatterns = [
    path('register', auth_views.RegisterEndpoint),
    path('login', auth_views.LoginEndpoint),
    path('logout', auth_views.LogoutEndpoint),
    path('refresh', auth_views.RefreshEndpoint),
    path('login/google', auth_views.LoginGoogleEndpoint),
    path('login/facebook', auth_views.LoginFacebookEndpoint),
    path('permissions', auth_views.UserPermissionsEndpoint),
    path('profile', auth_views.EditUserInformationEndpoint)
]