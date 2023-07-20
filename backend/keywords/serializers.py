from keywords.models import *
from rest_framework import serializers
from rest_framework_serializer_extensions.serializers import SerializerExtensionsMixin


class KeywordSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = "__all__"


class KeywordGroupSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = KeywordGroup
        fields = "__all__"
        expandable_fields = dict(
            keywords=dict(serializer=KeywordSerializer, many=True),
        )
