from .models import *
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_serializer_extensions.serializers import SerializerExtensionsMixin
from django.contrib.auth import authenticate
from keywords.serializers import KeywordSerializer
from relationships.models import Friendship


class ProfileSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
        expandable_fields = dict(
            keywords=dict(serializer=KeywordSerializer, many=True),
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class UserSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("pk", "username", "email")
        expandable_fields = dict(profile=ProfileSerializer)


class RegisterSerializer(serializers.ModelSerializer):
    """ Register 할 때에만 사용되는 Serializer임 """

    class Meta:
        model = User
        fields = ("pk", "username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return User.objects.get(pk=user.pk)
