import json
import logging
import os
import threading
import resend
from django.conf import settings
from cph_app.models import PushSubscription
from cph_app.push_notifications import send_push_notification

logger = logging.getLogger(__name__)

# Resend Email Configuration
resend.api_key = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "onboarding@resend.dev")

# HELPER FUNCTIONS (EMAIL & PUSH)

def send_email(to, subject, html):
    """Synchronous email sender using Resend."""
    try:
        resend.Emails.send({
            "from": f"Centre for Psychological Health <{FROM_EMAIL}>",
            "to": [to],
            "subject": subject,
            "html": html,
        })
        return True
    except Exception as e:
        logger.exception("Email send failed")
        return False


def send_email_async(to, subject, html):
    """Fire-and-forget email send using background thread."""
    def _worker():
        send_email(to, subject, html)

    threading.Thread(target=_worker, daemon=True).start()


def send_user_push_async(user, title, body, url="/dashboard"):
    """
    Fire-and-forget push notification sender for a specific user's registered devices.
    """
    def _worker():
        subscriptions = PushSubscription.objects.filter(user=user)
        for sub in subscriptions:
            send_push_notification(
                subscription_info=sub.get_subscription_info(),
                title=title,
                body=body,
                url=url,
            )

    threading.Thread(target=_worker, daemon=True).start()

# APPOINTMENT & NOTIFICATION FUNCTIONS

def booking_confirmation_email(appointment):
    """Send booking confirmation email and push notification to Client."""
    client = appointment.client
    consultant = appointment.consultant.user

    html = f"""
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Centre for Psychological Health</h1>
        </div>
        <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1e293b; font-size: 18px;">Booking Confirmed! ✅</h2>
            <p style="color: #475569;">Hi {client.full_name},</p>
            <p style="color: #475569;">Your appointment has been successfully booked.</p>

            <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 4px 0; color: #1e293b;"><strong>Consultant:</strong> {consultant.full_name}</p>
                <p style="margin: 4px 0; color: #1e293b;"><strong>Date:</strong> {appointment.appointment_date}</p>
                <p style="margin: 4px 0; color: #1e293b;"><strong>Time:</strong> {appointment.appointment_time}</p>
                <p style="margin: 4px 0; color: #1e293b;"><strong>Type:</strong> {appointment.get_session_type_display()}</p>
                <p style="margin: 4px 0; color: #1e293b;"><strong>Status:</strong> {appointment.get_status_display()}</p>
            </div>

            <p style="color: #475569; font-size: 14px;">We will notify you once your consultant confirms the appointment.</p>
        </div>
    </div>
    """
    send_email_async(client.email, "Booking Confirmation — Centre for Psychological Health", html)

    # Push Notification to Client
    send_user_push_async(
        user=client,
        title="Booking Submitted ✅",
        body=f"Your appointment with {consultant.full_name} on {appointment.appointment_date} has been placed.",
        url="/dashboard/bookings"
    )


def booking_status_update_email(appointment):
    """Send appointment status update email and push notification to Client."""
    client = appointment.client
    consultant = appointment.consultant.user
    status = appointment.status

    status_messages = {
        'confirmed': ('Appointment Confirmed ✅', '#16a34a', 'Your consultant has confirmed your appointment.'),
        'cancelled': ('Appointment Cancelled ❌', '#dc2626', 'Unfortunately, your appointment has been cancelled.'),
        'completed': ('Session Completed 🎉', '#2563eb', 'Your session has been marked as completed. Thank you for using our platform!'),
    }

    title, color, message = status_messages.get(
        status, 
        ('Appointment Update', '#2563eb', 'Your appointment status has been updated.')
    )

    html = f"""
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: {color}; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Centre for Psychological Health</h1>
        </div>
        <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1e293b; font-size: 18px;">{title}</h2>
            <p style="color: #475569;">Hi {client.full_name},</p>
            <p style="color: #475569;">{message}</p>

            <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 4px 0; color: #1e293b;"><strong>Consultant:</strong> {consultant.full_name}</p>
                <p style="margin: 4px 0; color: #1e293b;"><strong>Date:</strong> {appointment.appointment_date}</p>
                <p style="margin: 4px 0; color: #1e293b;"><strong>Time:</strong> {appointment.appointment_time}</p>
            </div>
        </div>
    </div>
    """
    send_email_async(client.email, title, html)

    # Push Notification to Client
    push_bodies = {
        "confirmed": f"Your appointment with {consultant.full_name} is confirmed ✅",
        "cancelled": f"Your appointment on {appointment.appointment_date} was cancelled ❌",
        "completed": "Your counseling session has been completed 🎉",
    }
    push_body = push_bodies.get(status, f"Status updated to {status}")

    send_user_push_async(
        user=client,
        title=title,
        body=push_body,
        url="/dashboard/bookings"
    )


def new_appointment_request_email(appointment):
    """Notify Consultant about new appointment request via email and push notification."""
    consultant = appointment.consultant.user
    client = appointment.client

    html = f"""
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Centre for Psychological Health</h1>
        </div>
        <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1e293b; font-size: 18px;">New Appointment Request 📅</h2>
            <p style="color: #475569;">Hi {consultant.full_name},</p>
            <p style="color: #475569;">You have received a new appointment request.</p>

            <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 4px 0; color: #1e293b;"><strong>Client:</strong> {client.full_name}</p>
                <p style="margin: 4px 0; color: #1e293b;"><strong>Date:</strong> {appointment.appointment_date}</p>
                <p style="margin: 4px 0; color: #1e293b;"><strong>Time:</strong> {appointment.appointment_time}</p>
                <p style="margin: 4px 0; color: #1e293b;"><strong>Type:</strong> {appointment.get_session_type_display()}</p>
            </div>

            <p style="color: #475569; font-size: 14px;">Please log in to your dashboard to confirm or decline this request.</p>
        </div>
    </div>
    """
    send_email_async(consultant.email, "New Appointment Request 📅", html)

    # Push Notification to Consultant
    send_user_push_async(
        user=consultant,
        title="New Appointment Request 📅",
        body=f"{client.full_name} requested a session on {appointment.appointment_date} at {appointment.appointment_time}.",
        url="/dashboard/appointments"
    )


def welcome_email(user):
    """Welcome email + push notification for newly registered users."""
    html = f"""
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Centre for Psychological Health</h1>
        </div>
        <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1e293b; font-size: 18px;">Welcome, {user.full_name}! 🎉</h2>
            <p style="color: #475569;">Thank you for joining Centre for Psychological Health.</p>
            <p style="color: #475569;">You can now browse our consultants, book appointments, and take mental health assessments.</p>
        </div>
    </div>
    """
    send_email_async(user.email, "Welcome to Centre for Psychological Health", html)

    send_user_push_async(
        user=user,
        title="Welcome to CPH! 🎉",
        body="Thank you for joining us. Take a moment to explore our mental health services.",
        url="/consultants"
    )



# CONSULTANT SPECIFIC EMAIL SERVICES


def send_consultant_welcome_email(to_email, full_name, temp_password):
    """Credentials email sent when an ADMIN creates a consultant account."""
    subject = "Welcome to Centre for Psychological Health - Account Credentials"

    html = f"""
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Centre for Psychological Health</h1>
        </div>
        <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1e293b; font-size: 18px;">Welcome to CPH Family! 🎉</h2>
            <p style="color: #475569;">Dear <strong>{full_name or 'Consultant'}</strong>,</p>
            <p style="color: #475569;">An administrator has created a Consultant account for you on our platform.</p>
            
            <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 4px 0; color: #1e293b;"><strong>Login Email:</strong> {to_email}</p>
                <p style="margin: 4px 0; color: #1e293b;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: bold;">{temp_password}</code></p>
            </div>

            <p style="color: #475569; font-size: 14px;">Please log in to your dashboard and change your password as soon as possible.</p>
        </div>
    </div>
    """
    return send_email(to_email, subject, html)


def send_consultant_welcome_email_async(to_email, full_name, temp_password):
    """Non-blocking variant used by the admin create flow."""
    def _worker():
        send_consultant_welcome_email(to_email, full_name, temp_password)

    threading.Thread(target=_worker, daemon=True).start()


def send_consultant_application_received_email(to_email, full_name):
    """Confirmation email for SELF-REGISTERED consultants (no password included)."""
    subject = "Application Received - Centre for Psychological Health"

    html = f"""
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">Centre for Psychological Health</h1>
        </div>
        <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1e293b; font-size: 18px;">Application Received 🎉</h2>
            <p style="color: #475569;">Dear <strong>{full_name or 'Therapist'}</strong>,</p>
            <p style="color: #475569;">
                Thank you for applying to join our therapist network. Your information has been received
                and our team will review it shortly.
            </p>
            <p style="color: #475569; font-size: 14px;">
                You can log in with the email and password you provided. Once your application is approved,
                your profile will become visible to patients.
            </p>
        </div>
    </div>
    """
    return send_email(to_email, subject, html)


def send_consultant_application_received_email_async(to_email, full_name):
    """Non-blocking variant used by the public self-registration flow."""
    def _worker():
        send_consultant_application_received_email(to_email, full_name)

    threading.Thread(target=_worker, daemon=True).start()


# Wrapper Aliases for backward compatibility
def notify_consultant_new_booking(appointment):
    """Alias to trigger new appointment request flow for consultant."""
    new_appointment_request_email(appointment)


def notify_client_status_update(appointment):
    """Alias to trigger status update flow for client."""
    booking_status_update_email(appointment)