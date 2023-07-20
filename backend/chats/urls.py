# chat/urls.py
from django.urls import path

from . import views

urlpatterns = [
    # path("", views.index, name="index"),
    # path("<str:room_name>/", views.room, name="room"),
    path("modoom/rooms/", views.ListCreateModoomChatRoomStatus.as_view()),
    path("<int:modoom_id>/rooms/", views.ListCreateModoomChatRoomStatus.as_view()),
    path("direct/rooms/", views.ListCreateDirectChatRoomStatus.as_view()),
    path("<str:nickname>/rooms/", views.ListCreateDirectChatRoomStatus.as_view()),
    path(
        "messages/modoom/<int:room_id>/",
        views.ListModoomMessages.as_view(),
    ),
    path(
        "messages/direct/<int:room_id>/",
        views.ListDirectMessages.as_view(),
    ),
]
