from channels.db import database_sync_to_async
from channels.generic.websocket import (
    AsyncJsonWebsocketConsumer,
)
from feeds.models import *
from .serializers import *
from utils import FRIEND_FIELDS_TO_SHOW
from utils import get_object_or_exception


class ModoomChatConsumer(AsyncJsonWebsocketConsumer):
    message_model = ModoomMessage
    message_serializer = ModoomMessageSerializer
    chatroom_model = ModoomChatRoom
    status_model = ModoomChatRoomStatus

    @database_sync_to_async
    def is_allowed(self):
        modoom_id = ModoomChatRoom.objects.get(pk=self.room_id).modoom_id
        if not Modoom.objects.get(pk=modoom_id).ongoing:
            return False
        return Enrollment.objects.filter(
            modoom_id=modoom_id, profile=self.user.profile, accepted=True
        ).exists()

    @database_sync_to_async
    def create_message(self, content):
        chatroom = get_object_or_exception(self.chatroom_model, id=self.room_id)
        message = self.message_model.objects.create(
            profile=self.user.profile,
            content=content,
            chat_room_id=self.room_id,
            position=chatroom.latest_position + 1,
        )
        chatroom.latest_position += 1
        chatroom.save()
        return self.message_serializer(
            message,
            context={
                "expand": ["profile"],
                "exclude": [
                    "profile__keywords",
                ],
            },
        ).data

    @database_sync_to_async
    def update_last_position(self):
        chatroom = self.chatroom_model.objects.get(id=self.room_id)
        self.status_model.objects.filter(
            chat_room=chatroom, recipient=self.user.profile
        ).update(last_position=chatroom.latest_position)

    async def connect(self):
        self.user = self.scope["user"]
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = "chat_%s" % self.room_id
        if self.user.is_anonymous:
            await self.close()
            return
        elif not await self.is_allowed():
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept("Token")

    async def disconnect(self, close_code):
        # Leave room group
        await self.update_last_position()
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive_json(self, content, **kwargs):
        message = content["message"]
        message_data = await self.create_message(message)
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message_data": message_data}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message_data = event["message_data"]
        await self.send_json(message_data)


class DirectChatConsumer(ModoomChatConsumer):
    message_model = DirectMessage
    message_serializer = DirectMessageSerializer
    chatroom_model = DirectChatRoom
    status_model = DirectChatRoomStatus

    @database_sync_to_async
    def is_allowed(self):
        dm_room = DirectChatRoom.objects.get(pk=self.room_id)
        retval = dm_room.participants.filter(pk=self.user.id).exists()
        return retval
