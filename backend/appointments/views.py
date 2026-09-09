from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from .models import Appointment
from core.permissions import IsRoleAdmin
from cph_app.authentication import CookieJWTAuthentication
from .serializers import (
    AppointmentCreateSerializer,
    AppointmentSerializer,
    AppointmentStatusUpdateSerializer,
)

from config.email_utils import (
    booking_confirmation_email,
    booking_status_update_email,
    new_appointment_request_email,
)


class AppointmentCreateView(generics.CreateAPIView):
    serializer_class = AppointmentCreateSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'write_action'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()

        # Email notifications
        booking_confirmation_email(appointment)
        new_appointment_request_email(appointment)

        return Response(
            AppointmentSerializer(appointment).data,
            status=status.HTTP_201_CREATED
        )


class AppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'consultant':
            return Appointment.objects.filter(
                consultant__user=user
            ).select_related('client', 'consultant__user')
        return Appointment.objects.filter(
            client=user
        ).select_related('client', 'consultant__user')


class AppointmentDetailView(generics.RetrieveAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'consultant':
            return Appointment.objects.filter(consultant__user=user)
        return Appointment.objects.filter(client=user)


class AppointmentStatusUpdateView(generics.UpdateAPIView):
    serializer_class = AppointmentStatusUpdateSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'write_action'
    http_method_names = ['patch']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'consultant':
            return Appointment.objects.filter(consultant__user=user)
        # Clients can only cancel appointments.
        return Appointment.objects.filter(client=user, status='pending')

    def patch(self, request, *args, **kwargs):
        appointment = self.get_object()
        user = request.user

        # Clients can only cancel appointments.
        if user.role == 'client':
            new_status = request.data.get('status')
            if new_status != 'cancelled':
                return Response(
                    {'error': 'Clients can only cancel appointments.'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Prevent same-day cancellation (policy: must cancel 24h in advance)
            from django.utils import timezone
            from datetime import timedelta
            now = timezone.now()
            appointment_datetime = timezone.make_aware(
                timezone.datetime.combine(
                    appointment.appointment_date,
                    appointment.appointment_time
                )
            )
            if appointment_datetime - now < timedelta(hours=24):
                return Response(
                    {'error': 'Appointments must be cancelled at least 24 hours in advance.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        response = super().patch(request, *args, **kwargs)

        # Email notification only if update is successful
        if response.status_code == status.HTTP_200_OK and 'status' in request.data:
            appointment.refresh_from_db()
            booking_status_update_email(appointment)

        return response


class BookedSlotsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, consultant_id):
        date = request.query_params.get('date')
        if not date:
            return Response(
                {'error': 'date parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booked = Appointment.objects.filter(
            consultant_id=consultant_id,
            appointment_date=date,
            status__in=['pending', 'confirmed']
        ).values_list('appointment_time', flat=True)

        return Response({'booked_slots': list(booked)})


class AdminStatsView(APIView):
    permission_classes = [IsRoleAdmin]

    def get(self, request):
        from django.contrib.auth import get_user_model
        from consultants.models import Consultant

        User = get_user_model()

        stats = {
            'total_users': User.objects.filter(role='client').count(),
            'total_consultants': Consultant.objects.count(),
            'verified_consultants': Consultant.objects.filter(is_verified=True).count(),
            'total_appointments': Appointment.objects.count(),
            'pending_appointments': Appointment.objects.filter(status='pending').count(),
            'confirmed_appointments': Appointment.objects.filter(status='confirmed').count(),
            'completed_appointments': Appointment.objects.filter(status='completed').count(),
            'cancelled_appointments': Appointment.objects.filter(status='cancelled').count(),
        }
        return Response(stats)


class AdminAnalyticsView(APIView):
    permission_classes = [IsRoleAdmin]

    def get(self, request):
        from datetime import timedelta
        from django.utils import timezone
        from django.contrib.auth import get_user_model
        from django.db.models import Count, Sum
        from django.db.models.functions import TruncDate
        from consultants.models import Consultant
        from assessments.models import QuizResult

        User = get_user_model()

        days = min(int(request.query_params.get('days', 30)), 365)
        since = timezone.now() - timedelta(days=days - 1)
        since_date = timezone.localdate() - timedelta(days=days - 1)

        # Appointments per day (last N days)
        appointment_daily = (
            Appointment.objects
            .filter(created_at__gte=since)
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )
        appointment_by_day = {str(row['day']): row['count'] for row in appointment_daily}

        # New client registrations per day (last N days)
        user_daily = (
            User.objects
            .filter(role='client', date_joined__gte=since)
            .annotate(day=TruncDate('date_joined'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )
        user_by_day = {str(row['day']): row['count'] for row in user_daily}

        # Assessment completions per day (last N days)
        quiz_daily = (
            QuizResult.objects
            .filter(completed_at__gte=since)
            .annotate(day=TruncDate('completed_at'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )
        quiz_by_day = {str(row['day']): row['count'] for row in quiz_daily}

        # Build the dense series for each day in range
        from datetime import timedelta as delta
        series = []
        for i in range(days):
            day = since_date + delta(days=i)
            key = str(day)
            series.append({
                'date': key,
                'appointments': appointment_by_day.get(key, 0),
                'registrations': user_by_day.get(key, 0),
                'assessments': quiz_by_day.get(key, 0),
            })

        # Top consultants by total appointments
        top_consultants = (
            Consultant.objects
            .annotate(total=Count('appointments'))
            .filter(total__gt=0)
            .order_by('-total')[:5]
            .values('id', 'user__full_name', 'total')
        )
        top_consultants = [
            {'name': row['user__full_name'] or 'Unnamed', 'sessions': row['total']}
            for row in top_consultants
        ]

        # Revenue estimate (confirmed + completed sessions)
        revenue_estimate = sum(
            a.consultant.consultation_fee
            for a in Appointment.objects.filter(status__in=['confirmed', 'completed'])
        )

        # Session type split
        session_types = list(
            Appointment.objects
            .values('session_type')
            .annotate(count=Count('id'))
        )

        return Response({
            'period_days': days,
            'series': series,
            'status_breakdown': {
                'pending': Appointment.objects.filter(status='pending').count(),
                'confirmed': Appointment.objects.filter(status='confirmed').count(),
                'completed': Appointment.objects.filter(status='completed').count(),
                'cancelled': Appointment.objects.filter(status='cancelled').count(),
            },
            'session_types': session_types,
            'top_consultants': top_consultants,
            'revenue_estimate': revenue_estimate,
        })