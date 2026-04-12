import json

from django.contrib.auth import get_user_model
from django.test import TestCase

from .models import PageView


class AnalyticsTests(TestCase):
    def test_track_page_view_creates_record(self):
        response = self.client.post(
            "/api/analytics/track/",
            data=json.dumps(
                {
                    "visitorId": "visitor-123",
                    "sessionId": "session-456",
                    "path": "/services",
                    "title": "Services",
                    "referrer": "https://www.google.com/",
                    "source": "website",
                }
            ),
            content_type="application/json",
            HTTP_USER_AGENT="Test Browser",
            REMOTE_ADDR="127.0.0.1",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(PageView.objects.count(), 1)

        page_view = PageView.objects.get()
        self.assertEqual(page_view.visitor_id, "visitor-123")
        self.assertEqual(page_view.session_id, "session-456")
        self.assertEqual(page_view.path, "/services")
        self.assertEqual(page_view.ip_address, "127.0.0.1")

    def test_track_page_view_requires_identity_and_path(self):
        response = self.client.post(
            "/api/analytics/track/",
            data=json.dumps({"visitorId": "visitor-123"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(PageView.objects.count(), 0)

    def test_summary_requires_staff_login(self):
        response = self.client.get("/api/analytics/summary/")

        self.assertEqual(response.status_code, 302)

    def test_staff_summary_counts_visitors_sessions_and_ips(self):
        User = get_user_model()
        User.objects.create_user(
            username="staff",
            password="password",
            is_staff=True,
        )
        self.client.login(username="staff", password="password")

        PageView.objects.create(
            visitor_id="visitor-1",
            session_id="session-1",
            path="/",
            ip_address="127.0.0.1",
        )
        PageView.objects.create(
            visitor_id="visitor-1",
            session_id="session-2",
            path="/services",
            ip_address="127.0.0.1",
        )

        response = self.client.get("/api/analytics/summary/")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["pageViews"], 2)
        self.assertEqual(payload["uniqueVisitors"], 1)
        self.assertEqual(payload["uniqueSessions"], 2)
        self.assertEqual(payload["uniqueIps"], 1)
