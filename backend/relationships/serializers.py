from relationships.models import *
from feeds.serializers import *


class ReviewSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        expandable_fields = dict(
            reviewee=dict(serializer=ProfileSerializer),
        )


class FriendRequestSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = "__all__"
        expandable_fields = dict(
            subject=dict(serializer=ProfileSerializer),
            object=dict(serializer=ProfileSerializer),
        )


class FriendshipSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = "__all__"
        expandable_fields = dict(
            subject=dict(serializer=ProfileSerializer),
            object=dict(serializer=ProfileSerializer),
        )


class ModoomshipSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = Modoomship
        fields = "__all__"
        expandable_fields = dict(
            modoom=dict(serializer=ModoomSerializer),
            subject=dict(serializer=ProfileSerializer),
            object=dict(serializer=ProfileSerializer),
            review=dict(serializer=ReviewSerializer),
        )
