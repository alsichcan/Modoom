from django.contrib import admin
from relationships.models import *
from import_export.admin import ImportExportModelAdmin
from import_export import resources, fields


class RelatinoshipResource(resources.ModelResource):
    sbj__full_name = fields.Field()
    obj__full_name = fields.Field()

    def dehydrate_sbj__full_name(self, obj):
        return f"{obj.subject.full_name}"

    def dehydrate_obj__full_name(self, obj):
        return f"{obj.object.full_name}"


class RelationshipAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = [
        "pk",
        "sbj__full_name",
        "subject",
        "obj__full_name",
        "object",
        "created_at",
    ]
    ordering = ["-pk", "subject", "object"]
    search_fields = [
        "subject__nickname",
        "subject__full_name",
        "object__nickname",
        "object__full_name",
    ]

    def sbj__full_name(self, obj):
        return f"{obj.subject.full_name}"

    def obj__full_name(self, obj):
        return f"{obj.object.full_name}"


class FriendRequestResource(RelatinoshipResource):
    obj_email = fields.Field()
    obj_rcv_enr_mails = fields.Field()
    obj_rcv_news_mails = fields.Field()

    def dehydrate_obj_email(self, obj):
        if obj.object:
            return f"{obj.object.pref_email}"
        else:
            return "None"

    def dehydrate_obj_rcv_enr_mails(self, obj):
        if obj.object:
            return f"{obj.object.receive_enroll_mails}"
        else:
            return "None"

    def dehydrate_obj_rcv_news_mails(self, obj):
        if obj.object:
            return f"{obj.object.receive_news_mails}"
        else:
            return "None"

    class Meta:
        model = FriendRequest
        fields = [
            "id",
            "sbj__full_name",
            "subject",
            "obj__full_name",
            "object",
            "created_at",
            "obj_email",
            "obj_rcv_enr_mails",
            "obj_rcv_news_mails",
        ]
        export_order = fields


class FriendRequestAdmin(RelationshipAdmin):
    resource_class = FriendRequestResource
    list_display = RelationshipAdmin.list_display + [
        "obj_email",
        "obj_rcv_enr_mails",
        "obj_rcv_news_mails",
    ]

    def obj_email(self, obj):
        if obj.object:
            return f"{obj.object.pref_email}"
        else:
            return "None"

    def obj_rcv_enr_mails(self, obj):
        if obj.object:
            return f"{obj.object.receive_enroll_mails}"
        else:
            return "None"

    def obj_rcv_news_mails(self, obj):
        if obj.object:
            return f"{obj.object.receive_news_mails}"
        else:
            return "None"


class FriendshipResource(RelatinoshipResource):
    class Meta:
        model = Friendship
        fields = [
            "id",
            "sbj__full_name",
            "subject",
            "obj__full_name",
            "object",
            "created_at",
        ]
        export_order = fields


class FriendshipAdmin(RelationshipAdmin):
    resource_class = FriendshipResource
    pass


admin.site.register(Review)
admin.site.register(FriendRequest, FriendRequestAdmin)
admin.site.register(Friendship, FriendshipAdmin)
admin.site.register(Modoomship)
