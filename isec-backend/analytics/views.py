import json
from datetime import timedelta

from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Count
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import PageView


MAX_FIELD_LENGTHS = {
    "visitor_id": 64,
    "session_id": 64,
    "path": 500,
    "title": 255,
    "referrer": 1000,
    "source": 100,
}


def _clean(value, field):
    return str(value or "").strip()[: MAX_FIELD_LENGTHS[field]]


def _get_client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


@csrf_exempt
@require_POST
def track_page_view(request):
    try:
        data = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    visitor_id = _clean(data.get("visitorId"), "visitor_id")
    session_id = _clean(data.get("sessionId"), "session_id")
    path = _clean(data.get("path"), "path")

    if not visitor_id or not session_id or not path:
        return JsonResponse(
            {"error": "visitorId, sessionId, and path are required"},
            status=400,
        )

    PageView.objects.create(
        visitor_id=visitor_id,
        session_id=session_id,
        path=path,
        title=_clean(data.get("title"), "title"),
        referrer=_clean(data.get("referrer"), "referrer"),
        source=_clean(data.get("source"), "source"),
        user_agent=str(request.META.get("HTTP_USER_AGENT", ""))[:1000],
        ip_address=_get_client_ip(request),
    )

    return JsonResponse({"success": True}, status=201)


@staff_member_required
@require_GET
def analytics_summary(request):
    try:
        days = min(max(int(request.GET.get("days", "30")), 1), 365)
    except ValueError:
        days = 30

    since = timezone.now() - timedelta(days=days)
    views = PageView.objects.filter(created_at__gte=since)

    top_pages = list(
        views.values("path")
        .annotate(views=Count("id"), visitors=Count("visitor_id", distinct=True))
        .order_by("-views")[:10]
    )

    return JsonResponse(
        {
            "days": days,
            "pageViews": views.count(),
            "uniqueVisitors": views.values("visitor_id").distinct().count(),
            "uniqueSessions": views.values("session_id").distinct().count(),
            "uniqueIps": views.values("ip_address").exclude(ip_address=None).distinct().count(),
            "topPages": top_pages,
        }
    )
