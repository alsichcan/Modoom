from rest_framework import serializers
from rest_framework_serializer_extensions.serializers import SerializerExtensionsMixin
from notifications.models import Notification
from users.serializers import ProfileSerializer


class NotificationSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        expandable_fields = dict(
            actor=dict(serializer=ProfileSerializer),
        )
