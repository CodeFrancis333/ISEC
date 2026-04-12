from django.db import models


class PageView(models.Model):
    visitor_id = models.CharField(max_length=64, db_index=True)
    session_id = models.CharField(max_length=64, db_index=True)
    path = models.CharField(max_length=500, db_index=True)
    title = models.CharField(max_length=255, blank=True)
    referrer = models.URLField(max_length=1000, blank=True)
    source = models.CharField(max_length=100, blank=True)
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.path} - {self.created_at:%Y-%m-%d %H:%M}"
