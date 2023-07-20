from feeds.models import *
from users.serializers import *
from keywords.serializers import *
from rest_framework import serializers
from rest_framework_serializer_extensions.serializers import SerializerExtensionsMixin
from rest_polymorphic.serializers import PolymorphicSerializer


class SubCommentSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    text_show = serializers.ReadOnlyField()
    liked = serializers.SerializerMethodField()

    def get_liked(self, obj):
        request_profile = self.context["request"].user.profile
        return request_profile in obj.likes.all()

    class Meta:
        model = SubComment
        fields = "__all__"
        expandable_fields = dict(
            profile=ProfileSerializer,
        )


class CommentSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    text_show = serializers.ReadOnlyField()
    liked = serializers.SerializerMethodField()

    def get_liked(self, obj):
        request_profile = self.context["request"].user.profile
        return request_profile in obj.likes.all()

    class Meta:
        model = Comment
        fields = "__all__"
        expandable_fields = dict(
            profile=ProfileSerializer,
            subcomments=dict(serializer=SubCommentSerializer, many=True),
        )


class EnrollmentSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"
        expandable_fields = dict(
            profile=dict(serializer=ProfileSerializer),
        )


class ModoomSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    liked = serializers.SerializerMethodField()

    def get_liked(self, obj):
        request_profile = self.context["request"].user.profile
        return request_profile in obj.likes.all()

    class Meta:
        model = Modoom
        fields = "__all__"
        expandable_fields = dict(
            profile=ProfileSerializer,
            enrollments=dict(serializer=EnrollmentSerializer, many=True),
            keywords=dict(serializer=KeywordSerializer, many=True),
        )
        extra_kwargs = {"keywords": {"required": False}}
