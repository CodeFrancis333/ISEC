import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@csrf_exempt
def send_inquiry(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    # Parse JSON safely
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    # Extract fields
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    organization = data.get("organization", "").strip()
    project_brief = data.get("projectBrief", "").strip()

    # Quick validation
    if not name or not email:
        return JsonResponse({"error": "Name and email are required"}, status=400)

    # Build email content
    subject = f"New Inquiry from {name} - ISEC Website"
    message = (
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Organization: {organization}\n\n"
        f"Project Brief:\n{project_brief}\n"
    )

    # Recipient (hidden in environment variables)
    recipient = getattr(settings, "INQUIRY_RECEIVER_EMAIL", None)

    if not recipient:
        logger.error("INQUIRY_RECEIVER_EMAIL not set in environment variables.")
        return JsonResponse(
            {"error": "Server email configuration error"}, status=500
        )

    # Attempt to send email
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
        )
    except Exception as e:
        logger.error(f"Email sending failed: {e}")
        return JsonResponse(
            {"error": "Failed to send inquiry email"}, status=500
        )

    return JsonResponse({"success": True, "message": "Inquiry sent successfully!"})
