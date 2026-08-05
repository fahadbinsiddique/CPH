import resend
import os
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