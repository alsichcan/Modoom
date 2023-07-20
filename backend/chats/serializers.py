from rest_framework import serializers
from rest_framework_serializer_extensions.serializers import SerializerExtensionsMixin

from .models import *
from users.serializers import ProfileSerializer
from feeds.serializers import ModoomSerializer


class ModoomChatRoomSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = ModoomChatRoom
        fields = "__all__"
        expandable_fields = dict(modoom=ModoomSerializer)


class DirectChatRoomSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = DirectChatRoom
        fields = "__all__"
        expandable_fields = dict(
            participants=dict(serializer=ProfileSerializer, many=True),
        )


class ModoomChatRoomStatusSerializer(
    SerializerExtensionsMixin, serializers.ModelSerializer
):
    unread_count = serializers.SerializerMethodField()

    def get_unread_count(self, obj):
        return obj.chat_room.latest_position - obj.last_position

    class Meta:
        model = ModoomChatRoomStatus
        fields = [
            "chat_room",
            "last_position",
            "unread_count",
        ]
        expandable_fields = dict(chat_room=ModoomChatRoomSerializer)


class DirectChatRoomStatusSerializer(
    SerializerExtensionsMixin, serializers.ModelSerializer
):
    unread_count = serializers.SerializerMethodField()

    def get_unread_count(self, obj):
        return obj.chat_room.latest_position - obj.last_position

    class Meta:
        model = DirectChatRoomStatus
        fields = [
            "recipient",
            "chat_room",
            "last_position",
            "unread_count",
        ]
        expandable_fields = dict(chat_room=DirectChatRoomSerializer)


class ModoomMessageSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = ModoomMessage
        fields = "__all__"
        expandable_fields = dict(
            profile=ProfileSerializer,
        )


class DirectMessageSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = DirectMessage
        fields = "__all__"
        expandable_fields = dict(
            profile=ProfileSerializer,
        )
