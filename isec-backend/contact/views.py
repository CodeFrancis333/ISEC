import json
import logging

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.mail import EmailMessage
from django.core.validators import validate_email
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger(__name__)


def _clean_text(value):
    return str(value or "").strip()


@csrf_exempt
def send_inquiry(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    name = _clean_text(data.get("name"))
    email = _clean_text(data.get("email"))
    organization = _clean_text(data.get("organization"))
    project_brief = _clean_text(data.get("projectBrief"))

    if not name or not email or not project_brief:
        return JsonResponse(
            {"error": "Name, email, and project brief are required"},
            status=400,
        )

    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({"error": "A valid email is required"}, status=400)

    recipient = _clean_text(getattr(settings, "INQUIRY_RECEIVER_EMAIL", ""))
    from_email = _clean_text(getattr(settings, "DEFAULT_FROM_EMAIL", ""))

    if not recipient or not from_email:
        logger.error("Inquiry email configuration is incomplete.")
        return JsonResponse(
            {"error": "Server email configuration error"},
            status=500,
        )

    subject = f"New Inquiry from {name} - ISEC Website"
    message = (
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Organization: {organization or 'Not provided'}\n\n"
        f"Project Brief:\n{project_brief}\n"
    )

    try:
        email_message = EmailMessage(
            subject=subject,
            body=message,
            from_email=from_email,
            to=[recipient],
            reply_to=[email],
        )
        email_message.send()
    except Exception as exc:
        logger.exception("Email sending failed: %s", exc)
        return JsonResponse(
            {"error": "Failed to send inquiry email"},
            status=500,
        )

    return JsonResponse(
        {"success": True, "message": "Inquiry sent successfully!"},
        status=200,
    )
