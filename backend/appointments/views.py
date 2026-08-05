from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Appointment
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
    permission_classes = [IsAdminUser]

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
            'completed_appointments': Appointment.objects.filter(status='completed').count(),
        }
        return Response(stats)