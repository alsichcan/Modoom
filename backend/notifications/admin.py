from django.contrib import admin
from notifications.models import *
from import_export.admin import ImportExportModelAdmin
from import_export import resources, fields


class EmailResource(resources.ModelResource):
    recipient_email = fields.Field()
    receive_enroll_mails = fields.Field()
    receive_news_mails = fields.Field()

    def dehydrate_recipient_email(self, obj):
        if obj.recipient:
            return f"{obj.recipient.pref_email}"
        else:
            return "None"

    def dehydrate_receive_enroll_mails(self, obj):
        if obj.recipient:
            return f"{obj.recipient.receive_enroll_mails}"
        else:
            return "None"

    def dehydrate_receive_news_mails(self, obj):
        if obj.recipient:
            return f"{obj.recipient.receive_news_mails}"
        else:
            return "None"

    class Meta:
        model = Email
        fields = [
            "id",
            "recipient",
            "subject",
            "description",
            "emailed",
            "created_at",
            "recipient_email",
            "receive_enroll_mails",
            "receive_news_mails",
        ]
        export_order = fields


class NotificationResource(resources.ModelResource):
    __str___ = fields.Field()
    recipient_email = fields.Field()
    receive_enroll_mails = fields.Field()
    receive_news_mails = fields.Field()

    def dehydrate_recipient_email(self, obj):
        if obj.recipient:
            return f"{obj.recipient.pref_email}"
        else:
            return "None"

    def dehydrate_receive_enroll_mails(self, obj):
        if obj.recipient:
            return f"{obj.recipient.receive_enroll_mails}"
        else:
            return "None"

    def dehydrate_receive_news_mails(self, obj):
        if obj.recipient:
            return f"{obj.recipient.receive_news_mails}"
        else:
            return "None"

    class Meta:
        model = Notification
        fields = [
            "id",
            "__str___",
            "recipient",
            "actor",
            "action",
            "target",
            "target_id",
            "unread",
            "deleted",
            "timestamp",
            "recipient_email",
            "receive_enroll_mails",
            "receive_news_mails",
        ]
        export_order = fields


class NotificationAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = NotificationResource
    list_display = [
        "pk",
        "__str__",
        "recipient",
        "actor",
        "action",
        "target",
        "target_id",
        "unread",
        "deleted",
        "timestamp",
        "recipient_email",
        "receive_enroll_mails",
        "receive_news_mails",
    ]
    ordering = [
        "-pk",
        "recipient",
        "actor",
        "action",
        "target",
        "target_id",
        "unread",
        "deleted",
    ]
    search_fields = ["recipient__full_name", "recipient__nickname", "action"]

    def recipient_email(self, obj):
        if obj.recipient:
            return f"{obj.recipient.pref_email}"
        else:
            return "None"

    def receive_enroll_mails(self, obj):
        if obj.recipient:
            return f"{obj.recipient.receive_enroll_mails}"
        else:
            return "None"

    def receive_news_mails(self, obj):
        if obj.recipient:
            return f"{obj.recipient.receive_news_mails}"
        else:
            return "None"


class EmailResource(resources.ModelResource):
    recipient_email = fields.Field()
    receive_enroll_mails = fields.Field()
    receive_news_mails = fields.Field()

    def dehydrate_recipient_email(self, obj):
        if obj.recipient:
            return f"{obj.recipient.pref_email}"
        else:
            return "None"

    def dehydrate_receive_enroll_mails(self, obj):
        if obj.recipient:
            return f"{obj.recipient.receive_enroll_mails}"
        else:
            return "None"

    def dehydrate_receive_news_mails(self, obj):
        if obj.recipient:
            return f"{obj.recipient.receive_news_mails}"
        else:
            return "None"

    class Meta:
        model = Email
        fields = [
            "id",
            "recipient",
            "subject",
            "description",
            "emailed",
            "created_at",
            "recipient_email",
            "receive_enroll_mails",
            "receive_news_mails",
        ]
        export_order = fields


class EmailAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = EmailResource
    list_display = [
        "pk",
        "recipient",
        "subject",
        "description",
        "emailed",
        "created_at",
        "recipient_email",
        "receive_enroll_mails",
        "receive_news_mails",
    ]
    ordering = [
        "-pk",
        "recipient",
        "subject",
        "description",
        "emailed",
    ]
    search_fields = ["recipient__nickname", "description"]

    def recipient_email(self, obj):
        if obj.recipient:
            return f"{obj.recipient.pref_email}"
        else:
            return "None"

    def receive_enroll_mails(self, obj):
        if obj.recipient:
            return f"{obj.recipient.receive_enroll_mails}"
        else:
            return "None"

    def receive_news_mails(self, obj):
        if obj.recipient:
            return f"{obj.recipient.receive_news_mails}"
        else:
            return "None"


admin.site.register(Notification, NotificationAdmin)
admin.site.register(Email, EmailAdmin)
