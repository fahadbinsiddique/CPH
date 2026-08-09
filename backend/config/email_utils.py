import resend
import os
import threading
from django.conf import settings

resend.api_key = os.getenv('RESEND_API_KEY')

FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'onboarding@resend.dev')


def send_email(to, subject, html):
    try:
        resend.Emails.send({
            "from": f"Centre for Psychological Health <{FROM_EMAIL}>",
            "to": [to],
            "subject": subject,
            "html": html,
        })
        return True
    except Exception as e:
        print(f"Email send failed: {e}")
        return False


def send_email_async(to, subject, html):
    """
    Fire-and-forget email send so the HTTP response is never blocked by the
    external Resend call. Errors are logged inside the worker thread only.
    """
    def _worker():
        send_email(to, subject, html)

    threading.Thread(target=_worker, daemon=True).start()


def booking_confirmation_email(appointment):
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
    send_email(client.email, "Booking Confirmation — Centre for Psychological Health", html)


def booking_status_update_email(appointment):
    client = appointment.client
    consultant = appointment.consultant.user
    status = appointment.status

    status_messages = {
        'confirmed': ('Appointment Confirmed ✅', '#16a34a', 'Your consultant has confirmed your appointment.'),
        'cancelled': ('Appointment Cancelled ❌', '#dc2626', 'Unfortunately, your appointment has been cancelled.'),
        'completed': ('Session Completed 🎉', '#2563eb', 'Your session has been marked as completed. Thank you for using our platform!'),
    }

    title, color, message = status_messages.get(status, ('Appointment Update', '#2563eb', 'Your appointment status has been updated.'))

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
    send_email(client.email, title, html)


def new_appointment_request_email(appointment):
    """Consultant notify  — new booking request"""
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
    send_email(consultant.email, "New Appointment Request", html)

def welcome_email(user):
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
    send_email(user.email, "Welcome to Centre for Psychological Health", html)


# consultants/services.py

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
    send_email_async(
        to_email,
        "Welcome to Centre for Psychological Health - Account Credentials",
        (
            f"Dear <strong>{full_name or 'Consultant'}</strong>,<br/><br/>"
            f"An administrator has created a Consultant account for you.<br/>"
            f"<strong>Login Email:</strong> {to_email}<br/>"
            f"<strong>Temporary Password:</strong> {temp_password}<br/><br/>"
            f"Please log in and change your password as soon as possible."
        ),
    )


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