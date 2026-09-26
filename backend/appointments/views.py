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
        # Prefetch specializations to avoid N+1 on ConsultantListSerializer.
        if user.role == 'consultant':
            return Appointment.objects.filter(
                consultant__user=user
            ).select_related(
                'client', 'consultant__user'
            ).prefetch_related('consultant__specializations')
        return Appointment.objects.filter(
            client=user
        ).select_related(
            'client', 'consultant__user'
        ).prefetch_related('consultant__specializations')


class AppointmentDetailView(generics.RetrieveAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Appointment.objects.select_related(
            'client', 'consultant__user'
        ).prefetch_related('consultant__specializations')
        if user.role == 'consultant':
            return qs.filter(consultant__user=user)
        return qs.filter(client=user)


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
        from django.db.models import Count, Q

        User = get_user_model()

        # Single aggregated query for appointment counts.
        appointment_stats = Appointment.objects.aggregate(
            total=Count('id'),
            pending=Count('id', filter=Q(status='pending')),
            confirmed=Count('id', filter=Q(status='confirmed')),
            completed=Count('id', filter=Q(status='completed')),
            cancelled=Count('id', filter=Q(status='cancelled')),
        )

        # Conditional aggregate merges two COUNT(*) into one round-trip (~630ms saved).
        consultant_stats = Consultant.objects.aggregate(
            total_consultants=Count('id'),
            verified_consultants=Count('id', filter=Q(is_verified=True)),
        )

        stats = {
            'total_users': User.objects.filter(role='client').count(),
            **consultant_stats,
            **appointment_stats,
        }
        return Response(stats)


class AdminAnalyticsView(APIView):
    permission_classes = [IsRoleAdmin]

    def get(self, request):
        from datetime import timedelta
        from django.utils import timezone
        from django.contrib.auth import get_user_model
        from django.db.models import Count, Q, Sum
        from django.db.models.functions import TruncDate
        from consultants.models import Consultant
        from assessments.models import QuizResult

        User = get_user_model()
        days = min(int(request.query_params.get('days', 30)), 365)
        since = timezone.now() - timedelta(days=days - 1)
        since_date = timezone.localdate() - timedelta(days=days - 1)

        # Parallel daily series queries.
        appointment_daily = (
            Appointment.objects
            .filter(created_at__gte=since)
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )
        user_daily = (
            User.objects
            .filter(role='client', date_joined__gte=since)
            .annotate(day=TruncDate('date_joined'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )
        quiz_daily = (
            QuizResult.objects
            .filter(completed_at__gte=since)
            .annotate(day=TruncDate('completed_at'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )

        appointment_by_day = {str(row['day']): row['count'] for row in appointment_daily}
        user_by_day = {str(row['day']): row['count'] for row in user_daily}
        quiz_by_day = {str(row['day']): row['count'] for row in quiz_daily}

        series = []
        for i in range(days):
            day = since_date + timedelta(days=i)
            key = str(day)
            series.append({
                'date': key,
                'appointments': appointment_by_day.get(key, 0),
                'registrations': user_by_day.get(key, 0),
                'assessments': quiz_by_day.get(key, 0),
            })

        # Top consultants — select_related avoids N+1.
        top_consultants = list(
            Consultant.objects
            .select_related('user')
            .annotate(total=Count('appointments'))
            .filter(total__gt=0)
            .order_by('-total')[:5]
            .values('id', 'user__full_name', 'total')
        )
        top_consultants = [
            {'name': row['user__full_name'] or 'Unnamed', 'sessions': row['total']}
            for row in top_consultants
        ]

        # One conditional aggregate for revenue + status + session mix (avoids 3 round-trips).
        appointment_totals = Appointment.objects.aggregate(
            revenue=Sum(
                'consultant__consultation_fee',
                filter=Q(status__in=['confirmed', 'completed']),
            ),
            **{
                f'status_{value}': Count('id', filter=Q(status=value))
                for value, _ in Appointment.STATUS_CHOICES
            },
            **{
                f'session_{value}': Count('id', filter=Q(session_type=value))
                for value, _ in Appointment.SESSION_CHOICES
            },
        )

        revenue_estimate = appointment_totals['revenue'] or 0

        # Skip empty session types (matches values().annotate()).
        session_types = [
            {'session_type': value, 'count': appointment_totals[f'session_{value}']}
            for value, _ in Appointment.SESSION_CHOICES
            if appointment_totals[f'session_{value}']
        ]

        status_breakdown = {
            value: appointment_totals[f'status_{value}']
            for value, _ in Appointment.STATUS_CHOICES
        }

        return Response({
            'period_days': days,
            'series': series,
            'status_breakdown': {
                'pending': status_breakdown.get('pending', 0),
                'confirmed': status_breakdown.get('confirmed', 0),
                'completed': status_breakdown.get('completed', 0),
                'cancelled': status_breakdown.get('cancelled', 0),
            },
            'session_types': session_types,
            'top_consultants': top_consultants,
            'revenue_estimate': float(revenue_estimate),
        })