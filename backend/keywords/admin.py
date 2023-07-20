from django.contrib import admin
from .models import *
from import_export.admin import ImportExportModelAdmin
from import_export import resources, fields


class KeywordGroupAdmin(admin.ModelAdmin):
    list_display = [
        "pk",
        "name",
        "n_keywords",
        "n_modooms",
        "custom_order",
        "created_at",
        "updated_at",
    ]
    ordering = ["-pk", "custom_order", "name", "updated_at"]
    search_fields = ["name"]


class KeywordResource(resources.ModelResource):
    class Meta:
        model = Keyword
        fields = [
            "id",
            "name",
            "n_modooms",
            "created_at",
            "updated_at",
        ]
        export_order = fields


class KeywordAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = KeywordResource
    list_display = [
        "pk",
        "name",
        "n_modooms",
        "created_at",
        "updated_at",
    ]
    ordering = ["-pk", "name", "updated_at"]
    search_fields = ["name", "keyword_group__name"]


admin.site.register(KeywordGroup, KeywordGroupAdmin)
admin.site.register(Keyword, KeywordAdmin)
