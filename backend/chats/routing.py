from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/chats/modoom/<int:room_id>/", consumers.ModoomChatConsumer.as_asgi()),
    path("ws/chats/direct/<int:room_id>/", consumers.DirectChatConsumer.as_asgi()),
]
