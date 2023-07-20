from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from notifications.views import *

urlpatterns = [
    path("<str:command>/<int:id>/", UpdateNotification.as_view()),
    path("<str:command>/", UpdateListNotifications.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
