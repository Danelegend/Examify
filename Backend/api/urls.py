from django.urls import path, include

urlpatterns = [
    path('exam/', include("ExamModule.urls")),
    path('user/', include("UserModule.urls"))
]