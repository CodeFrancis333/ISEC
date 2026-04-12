from django.contrib import admin

from .models import PageView


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = (
        "created_at",
        "path",
        "visitor_id",
        "session_id",
        "ip_address",
        "source",
    )
    list_filter = ("created_at", "path", "source")
    search_fields = ("visitor_id", "session_id", "path", "ip_address", "user_agent")
    readonly_fields = (
        "visitor_id",
        "session_id",
        "path",
        "title",
        "referrer",
        "source",
        "user_agent",
        "ip_address",
        "created_at",
    )
    date_hierarchy = "created_at"

    def has_add_permission(self, request):
        return False
