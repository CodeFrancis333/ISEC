import json

from django.core import mail
from django.test import TestCase, override_settings


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    DEFAULT_FROM_EMAIL="no-reply@example.com",
    INQUIRY_RECEIVER_EMAIL="team@example.com",
)
class SendInquiryTests(TestCase):
    def test_send_inquiry_success(self):
        response = self.client.post(
            "/api/contact/",
            data=json.dumps(
                {
                    "name": "Jane Doe",
                    "email": "jane@example.com",
                    "organization": "Acme Design",
                    "projectBrief": "Need structural review for a 3-storey project.",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["success"], True)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].reply_to, ["jane@example.com"])
        self.assertIn("Jane Doe", mail.outbox[0].body)

    def test_send_inquiry_rejects_missing_required_fields(self):
        response = self.client.post(
            "/api/contact/",
            data=json.dumps({"name": "Jane Doe", "email": ""}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json()["error"],
            "Name, email, and project brief are required",
        )

    def test_send_inquiry_rejects_invalid_email(self):
        response = self.client.post(
            "/api/contact/",
            data=json.dumps(
                {
                    "name": "Jane Doe",
                    "email": "not-an-email",
                    "projectBrief": "Need a review.",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["error"], "A valid email is required")

    def test_send_inquiry_rejects_invalid_json(self):
        response = self.client.post(
            "/api/contact/",
            data="{invalid",
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["error"], "Invalid JSON format")

    def test_send_inquiry_rejects_non_post_requests(self):
        response = self.client.get("/api/contact/")

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()["error"], "Only POST allowed")

    @override_settings(INQUIRY_RECEIVER_EMAIL="")
    def test_send_inquiry_fails_when_email_config_is_missing(self):
        response = self.client.post(
            "/api/contact/",
            data=json.dumps(
                {
                    "name": "Jane Doe",
                    "email": "jane@example.com",
                    "projectBrief": "Need a review.",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 500)
        self.assertEqual(
            response.json()["error"],
            "Server email configuration error",
        )
