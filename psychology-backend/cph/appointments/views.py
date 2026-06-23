from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Appointment
from .serializers import (
    AppointmentCreateSerializer,
    AppointmentSerializer,
    AppointmentStatusUpdateSerializer,
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
        # Client শুধু cancel করতে পারবে
        return Appointment.objects.filter(client=user, status='pending')

    def patch(self, request, *args, **kwargs):
        appointment = self.get_object()
        user = request.user

        # Client শুধু cancel করতে পারবে
        if user.role == 'client':
            new_status = request.data.get('status')
            if new_status != 'cancelled':
                return Response(
                    {'error': 'you can do only appointment cancel'},
                    status=status.HTTP_403_FORBIDDEN
                )

        return super().patch(request, *args, **kwargs)


class BookedSlotsView(APIView):
    

    def get(self, request, consultant_id):
        date = request.query_params.get('date')
        if not date:
            return Response(
                {'error': 'date parameter দরকার'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booked = Appointment.objects.filter(
            consultant_id=consultant_id,
            appointment_date=date,
            status__in=['pending', 'confirmed']
        ).values_list('appointment_time', flat=True)

        return Response({'booked_slots': list(booked)})