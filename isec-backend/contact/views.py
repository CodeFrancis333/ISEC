from django.shortcuts import render

# Create your views here.
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings


@csrf_exempt
def send_inquiry(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    name = data.get('name', '')
    email = data.get('email', '')
    organization = data.get('organization', '')
    project_brief = data.get('projectBrief', '')

    subject = f"New Inquiry from {name or 'Unknown'} - ISEC Website"
    message = (
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Organization: {organization}\n\n"
        f"Project Brief:\n{project_brief}"
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=['youremail@isec.ph'],  # TODO: change to your real email
    )

    return JsonResponse({'success': True})
