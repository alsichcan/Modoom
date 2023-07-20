from .models import *
from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget, ManyToManyWidget


class ModoomResource(resources.ModelResource):
    n_enrollments = fields.Field()
    leader = fields.Field()
    leader_email = fields.Field()
    receive_enroll_mails = fields.Field()
    receive_news_mails = fields.Field()

    def dehydrate_n_enrollments(self, obj):
        return f"{obj.enrollments.count()}"

    def dehydrate_leader(self, obj):
        if obj.profile:
            return f"{obj.profile.full_name}"
        else:
            return "None"

    def dehydrate_leader_email(self, obj):
        if obj.profile:
            return f"{obj.profile.pref_email}"
        else:
            return "None"

    def dehydrate_receive_enroll_mails(self, obj):
        if obj.profile:
            return f"{obj.profile.receive_enroll_mails}"
        else:
            return "None"

    def dehydrate_receive_news_mails(self, obj):
        if obj.profile:
            return f"{obj.profile.receive_news_mails}"
        else:
            return "None"

    class Meta:
        model = Modoom
        fields = [
            "id",
            "custom_order",
            "title",
            "n_members",
            "n_enrollments",
            "created_at",
            "leader",
            "profile",
            "leader_email",
            "receive_enroll_mails",
            "receive_news_mails",
            "n_comments",
            "n_likes",
        ]
        export_order = fields


class ModoomAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = ModoomResource
    list_display = [
        "pk",
        "custom_order",
        "title",
        "n_members",
        "n_enrollments",
        "created_at",
        "leader",
        "profile",
        "leader_email",
        "receive_enroll_mails",
        "receive_news_mails",
        "n_comments",
        "n_likes",
    ]
    ordering = [
        "-pk",
        "-custom_order",
        "title",
        "profile",
        "n_members",
        "n_comments",
        "n_likes",
    ]
    search_fields = [
        "title",
        "keywords__name",
        "profile__nickname",
        "profile__full_name",
    ]

    def leader(self, obj):
        if obj.profile:
            return f"{obj.profile.full_name}"
        else:
            return "None"

    def leader_email(self, obj):
        if obj.profile:
            return f"{obj.profile.pref_email}"
        else:
            return "None"

    def n_enrollments(self, obj):
        return f"{obj.enrollments.all().count()}"

    def receive_enroll_mails(self, obj):
        if obj.profile:
            return f"{obj.profile.receive_enroll_mails}"
        else:
            return "None"

    def receive_news_mails(self, obj):
        if obj.profile:
            return f"{obj.profile.receive_news_mails}"
        else:
            return "None"


class EnrollmentResource(resources.ModelResource):
    applicant = fields.Field()
    applicant_email = fields.Field()
    applicant_rcv_enr_mails = fields.Field()
    leader = fields.Field()
    leader_email = fields.Field()
    leader_rcv_enr_mails = fields.Field()

    def dehydrate_leader(self, obj):
        if obj.modoom.profile:
            return f"{obj.modoom.profile.full_name}"
        else:
            return "None"

    def dehydrate_leader_email(self, obj):
        if obj.modoom.profile:
            return f"{obj.modoom.profile.pref_email}"
        else:
            return "None"

    def dehydrate_leader_rcv_enr_mails(self, obj):
        if obj.modoom.profile:
            return f"{obj.modoom.profile.receive_enroll_mails}"
        else:
            return "None"

    def dehydrate_applicant(self, obj):
        if obj.profile:
            return f"{obj.profile.full_name}"
        else:
            return "None"

    def dehydrate_applicant_email(self, obj):
        if obj.profile:
            return f"{obj.profile.pref_email}"
        else:
            return "None"

    def dehydrate_applicant_rcv_enr_mails(self, obj):
        if obj.profile:
            return f"{obj.profile.receive_enroll_mails}"
        else:
            return "None"

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "modoom",
            "applicant",
            "profile",
            "accepted",
            "created_at",
            "leader",
            "leader_email",
            "leader_rcv_enr_mails",
            "applicant_email",
            "applicant_rcv_enr_mails",
        ]
        export_order = fields


class EnrollmentAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = EnrollmentResource
    list_display = [
        "pk",
        "modoom",
        "applicant",
        "profile",
        "accepted",
        "created_at",
        "leader",
        "leader_email",
        "leader_rcv_enr_mails",
        "applicant_email",
        "applicant_rcv_enr_mails",
    ]
    ordering = ["-pk", "profile", "modoom", "accepted"]
    search_fields = ["profile__full_name", "profile__nickname", "modoom__title"]

    def leader(self, obj):
        if obj.modoom.profile:
            return f"{obj.modoom.profile.full_name}"
        else:
            return "None"

    def leader_email(self, obj):
        if obj.modoom.profile:
            return f"{obj.modoom.profile.pref_email}"
        else:
            return "None"

    def leader_rcv_enr_mails(self, obj):
        if obj.modoom.profile:
            return f"{obj.modoom.profile.receive_enroll_mails}"
        else:
            return "None"

    def applicant(self, obj):
        if obj.profile:
            return f"{obj.profile.full_name}"
        else:
            return "None"

    def applicant_email(self, obj):
        if obj.profile:
            return f"{obj.profile.pref_email}"
        else:
            return "None"

    def applicant_rcv_enr_mails(self, obj):
        if obj.profile:
            return f"{obj.profile.receive_enroll_mails}"
        else:
            return "None"


class CommentResource(resources.ModelResource):
    full_name = fields.Field()

    def dehydrate_full_name(self, obj):
        if obj.profile:
            return f"{obj.profile.full_name}"
        else:
            return "None"

    class Meta:
        model = Comment
        fields = [
            "id",
            "modoom",
            "full_name",
            "profile",
            "text",
            "created_at",
            "deleted",
        ]
        export_order = fields


class CommentAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = CommentResource
    list_display = [
        "pk",
        "modoom",
        "full_name",
        "profile",
        "text_preview",
        "created_at",
        "deleted",
    ]

    ordering = ["-pk", "modoom", "profile", "deleted"]
    search_fields = [
        "profile__full_name",
        "profile__nickname",
        "modoom__title",
        "text",
    ]

    def full_name(self, obj):
        if obj.profile:
            return f"{obj.profile.full_name}"
        else:
            return "None"

    def text_preview(self, obj):
        return f"{obj.text[:20]}"


class SubCommentResource(resources.ModelResource):
    full_name = fields.Field()

    def dehydrate_full_name(self, obj):
        if obj.profile:
            return f"{obj.profile.full_name}"
        else:
            return "None"

    class Meta:
        model = SubComment
        fields = [
            "id",
            "comment",
            "full_name",
            "profile",
            "text",
            "created_at",
            "deleted",
        ]
        export_order = fields


class SubCommentAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = SubCommentResource
    list_display = [
        "pk",
        "comment",
        "full_name",
        "profile",
        "text_preview",
        "created_at",
        "deleted",
    ]

    ordering = ["-pk", "comment", "profile", "deleted"]
    search_fields = [
        "profile__full_name",
        "profile__nickname",
        "comment__modoom__title",
        "text",
    ]

    def full_name(self, obj):
        if obj.profile:
            return f"{obj.profile.full_name}"
        else:
            return "None"

    def text_preview(self, obj):
        return f"{obj.text[:20]}"


admin.site.register(Modoom, ModoomAdmin)
admin.site.register(Enrollment, EnrollmentAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(SubComment, SubCommentAdmin)
