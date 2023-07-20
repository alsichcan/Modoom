from django.contrib import admin
from chats.models import *
from django.db.models import Q
from import_export.admin import ImportExportModelAdmin
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget, ManyToManyWidget


class ModoomChatRoomResource(resources.ModelResource):
    created_at = fields.Field()
    n_members = fields.Field()

    def dehydrate_created_at(self, obj):
        return f"{obj.modoom.created_at}"

    def dehydrate_n_members(self, obj):
        return f"{obj.modoom.n_members}"

    class Meta:
        model = ModoomChatRoom
        fields = ["id", "modoom", "n_members", "latest_position", "created_at"]
        export_order = fields


class ModoomChatRoomAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = ModoomChatRoomResource
    list_display = [
        "pk",
        "modoom",
        "n_members",
        "latest_position",
        "created_at",
    ]
    ordering = ["-pk", "modoom", "latest_position"]
    search_fields = ["modoom__title"]

    def created_at(self, obj):
        return f"{obj.modoom.created_at}"

    def n_members(self, obj):
        return f"{obj.modoom.n_members}"


class DirectChatRoomResource(resources.ModelResource):
    participant1 = fields.Field()
    participant1_nickname = fields.Field()
    participant2 = fields.Field()
    participant2_nickname = fields.Field()

    def dehydrate_participant1(self, obj):
        if obj.participants:
            return f"{obj.participants.first().full_name}"
        else:
            return "None"

    def dehydrate_participant1_nickname(self, obj):
        if obj.participants:
            return f"{obj.participants.first().nickname}"
        else:
            return "None"

    def dehydrate_participant2(self, obj):
        if obj.participants.count() == 2:
            return f"{obj.participants.last().full_name}"
        else:
            return "None"

    def dehydrate_participant2_nickname(self, obj):
        if obj.participants.count() == 2:
            return f"{obj.participants.last().nickname}"
        else:
            return "None"

    class Meta:
        model = DirectChatRoom
        fields = [
            "id",
            "participant1",
            "participant1_nickname",
            "participant2",
            "participant2_nickname",
            "latest_position",
        ]
        export_order = fields


class DirectChatRoomAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = DirectChatRoomResource
    list_display = [
        "pk",
        "participant1",
        "participant1_nickname",
        "participant2",
        "participant2_nickname",
        "latest_position",
    ]
    ordering = ["-pk", "latest_position"]
    search_fields = ["participants__full_name", "participants__nickname"]

    def participant1(self, obj):
        if obj.participants:
            return f"{obj.participants.first().full_name}"
        else:
            return "None"

    def participant1_nickname(self, obj):
        if obj.participants:
            return f"{obj.participants.first().nickname}"
        else:
            return "None"

    def participant2(self, obj):
        if obj.participants.count() == 2:
            return f"{obj.participants.last().full_name}"
        else:
            return "None"

    def participant2_nickname(self, obj):
        if obj.participants.count() == 2:
            return f"{obj.participants.last().nickname}"
        else:
            return "None"


class ModoomChatRoomStatusResource(resources.ModelResource):
    full_name = fields.Field()
    latest_position = fields.Field()
    n_unreads = fields.Field()
    recipient_email = fields.Field()
    recipient_rcv_enr_mails = fields.Field()

    def dehydrate_full_name(self, obj):
        return f"{obj.recipient.full_name}"

    def dehydrate_latest_position(self, obj):
        return f"{obj.chat_room.latest_position}"

    def dehydrate_n_unreads(self, obj):
        return f"{obj.chat_room.latest_position - obj.last_position}"

    def dehydrate_recipient_email(self, obj):
        return f"{obj.recipient.pref_email}"

    def dehydrate_recipient_rcv_enr_mails(self, obj):
        return f"{obj.recipient.receive_enroll_mails}"

    class Meta:
        model = ModoomChatRoomStatus
        fields = [
            "id",
            "full_name",
            "recipient",
            "chat_room",
            "last_position",
            "latest_position",
            "n_unreads",
            "recipient_email",
            "recipient_rcv_enr_mails",
        ]
        export_order = fields


class ModoomChatRoomStatusAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = ModoomChatRoomStatusResource
    list_display = [
        "pk",
        "full_name",
        "recipient",
        "chat_room",
        "last_position",
        "latest_position",
        "n_unreads",
        "recipient_email",
        "recipient_rcv_enr_mails",
    ]
    ordering = ["-pk", "recipient", "chat_room", "last_position"]
    search_fields = [
        "recipient__full_name",
        "recipient__nickname",
        "chat_room__modoom__title",
    ]

    def full_name(self, obj):
        return f"{obj.recipient.full_name}"

    def latest_position(self, obj):
        return f"{obj.chat_room.latest_position}"

    def n_unreads(self, obj):
        return f"{obj.chat_room.latest_position - obj.last_position}"

    def recipient_email(self, obj):
        return f"{obj.recipient.pref_email}"

    def recipient_rcv_enr_mails(self, obj):
        return f"{obj.recipient.receive_enroll_mails}"


class DirectChatRoomStatusResource(resources.ModelResource):
    full_name = fields.Field()
    latest_position = fields.Field()
    n_unreads = fields.Field()
    recipient_email = fields.Field()
    recipient_rcv_enr_mails = fields.Field()

    def dehydrate_full_name(self, obj):
        return f"{obj.recipient.full_name}"

    def dehydrate_latest_position(self, obj):
        return f"{obj.chat_room.latest_position}"

    def dehydrate_n_unreads(self, obj):
        return f"{obj.chat_room.latest_position - obj.last_position}"

    def dehydrate_recipient_email(self, obj):
        return f"{obj.recipient.pref_email}"

    def dehydrate_recipient_rcv_enr_mails(self, obj):
        return f"{obj.recipient.receive_enroll_mails}"

    class Meta:
        model = DirectChatRoomStatus
        fields = [
            "id",
            "full_name",
            "recipient",
            "chat_room",
            "last_position",
            "latest_position",
            "n_unreads",
            "recipient_email",
            "recipient_rcv_enr_mails",
        ]
        export_order = fields


class DirectChatRoomStatusAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = DirectChatRoomStatusResource
    list_display = [
        "pk",
        "full_name",
        "recipient",
        "chat_room",
        "last_position",
        "latest_position",
        "n_unreads",
        "recipient_email",
        "recipient_rcv_enr_mails",
    ]
    ordering = ["-pk", "recipient", "chat_room", "last_position"]
    search_fields = [
        "recipient__full_name",
        "recipient__nickname",
        "chat_room__participants__full_name",
        "chat_room__participants__nickname",
    ]

    def full_name(self, obj):
        return f"{obj.recipient.full_name}"

    def latest_position(self, obj):
        return f"{obj.chat_room.latest_position}"

    def n_unreads(self, obj):
        return f"{obj.chat_room.latest_position - obj.last_position}"

    def recipient_email(self, obj):
        return f"{obj.recipient.pref_email}"

    def recipient_rcv_enr_mails(self, obj):
        return f"{obj.recipient.receive_enroll_mails}"


class ModoomMessageResource(resources.ModelResource):
    full_name = fields.Field()

    def dehydrate_full_name(self, obj):
        if obj.profile:
            return f"{obj.profile.full_name}"
        else:
            return "None"

    class Meta:
        model = ModoomMessage
        fields = [
            "id",
            "full_name",
            "profile",
            "chat_room",
            "content",
            "position",
            "created_at",
        ]
        export_order = fields


class ModoomMessageAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = ModoomMessageResource
    list_display = [
        "pk",
        "full_name",
        "profile",
        "chat_room",
        "content_preview",
        "position",
        "created_at",
    ]
    ordering = ["-pk", "profile", "chat_room", "position"]
    search_fields = [
        "profile__full_name",
        "profile__nickname",
        "content",
        "chat_room__modoom__title",
    ]

    def full_name(self, obj):
        if obj.profile:
            return f"{obj.profile.full_name}"
        else:
            return "None"

    def content_preview(self, obj):
        return f"{obj.content[:20]}"


class DirectMessageResource(resources.ModelResource):
    full_name = fields.Field()

    def dehydrate_full_name(self, obj):
        if obj.profile:
            return f"{obj.profile.full_name}"
        else:
            return "None"

    class Meta:
        model = DirectMessage
        fields = [
            "id",
            "full_name",
            "profile",
            "chat_room",
            "content",
            "position",
            "created_at",
        ]
        export_order = fields


class DirectMessageAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = DirectMessageResource
    list_display = [
        "pk",
        "full_name",
        "profile",
        "chat_room",
        "content_preview",
        "position",
        "created_at",
    ]
    ordering = ["-pk", "profile", "chat_room", "position"]
    search_fields = [
        "profile__full_name",
        "profile__nickname",
        "content",
        "chat_room__participants__full_name",
        "chat_room__participants__nickname",
    ]

    def full_name(self, obj):
        if obj.profile:
            return f"{obj.profile.full_name}"
        else:
            return "None"

    def content_preview(self, obj):
        return f"{obj.content[:20]}"


admin.site.register(ModoomChatRoom, ModoomChatRoomAdmin)
admin.site.register(DirectChatRoom, DirectChatRoomAdmin)
admin.site.register(ModoomChatRoomStatus, ModoomChatRoomStatusAdmin)
admin.site.register(DirectChatRoomStatus, DirectChatRoomStatusAdmin)
admin.site.register(ModoomMessage, ModoomMessageAdmin)
admin.site.register(DirectMessage, DirectMessageAdmin)
