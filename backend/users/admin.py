from django.contrib import admin
from .models import *
from import_export.admin import ImportExportModelAdmin
from import_export import resources, fields


class TempUserAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "email",
        "verification_code",
    )

    ordering = [
        "-pk",
    ]

    search_fields = ["email"]


class ProfileResource(resources.ModelResource):
    username = fields.Field()
    n_modoom_msgs = fields.Field()
    n_direct_msgs = fields.Field()
    n_enrollments = fields.Field()

    def dehydrate_username(self, obj):
        return f"{obj.user.username}"

    def dehydrate_n_enrollments(self, obj):
        return f"{obj.enrollments.count()}"

    def dehydrate_n_modoom_msgs(self, obj):
        return f"{obj.modoommessage.count()}"

    def dehydrate_n_direct_msgs(self, obj):
        return f"{obj.directmessage.count()}"

    class Meta:
        model = Profile
        fields = [
            "user",
            "full_name",
            "nickname",
            "contact_info",
            "username",
            "n_modooms",
            "n_friends",
            "n_modoomees",
            "n_enrollments",
            "n_modoom_msgs",
            "n_direct_msgs",
            "n_modoom_likes",
            "created_at",
            "pref_email",
            "receive_enroll_mails",
            "receive_news_mails",
        ]
        export_order = fields


class ProfileAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = ProfileResource
    list_display = [
        "pk",
        "full_name",
        "contact_info",
        "nickname",
        "username",
        "n_modooms",
        "n_friends",
        "n_modoomees",
        "n_enrollments",
        "n_modoom_msgs",
        "n_direct_msgs",
        "n_modoom_likes",
        "created_at",
        "pref_email",
        "receive_enroll_mails",
        "receive_news_mails",
    ]

    ordering = [
        "-pk",
        "full_name",
        "nickname",
        "contact_info",
        "n_modooms",
        "n_friends",
        "n_modoomees",
        "receive_enroll_mails",
        "receive_news_mails",
    ]

    search_fields = [
        "full_name",
        "nickname",
        "contact_info",
    ]

    def username(self, obj):
        return f"{obj.user.username}"

    def n_enrollments(self, obj):
        return f"{obj.enrollments.count()}"

    def n_modoom_msgs(self, obj):
        return f"{obj.modoommessage.count()}"

    def n_direct_msgs(self, obj):
        return f"{obj.directmessage.count()}"


admin.site.register(TempUser, TempUserAdmin)
admin.site.register(Profile, ProfileAdmin)
