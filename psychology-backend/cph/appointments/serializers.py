from rest_framework import serializers
from .models import Appointment
from cph_app.serializers import UserSerializer
from consultants.serializers import ConsultantListSerializer


class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'id', 'consultant', 'appointment_date',
            'appointment_time', 'session_type', 'client_message',
        ]

    def validate(self, attrs):
        consultant = attrs['consultant']
        date = attrs['appointment_date']
        time = attrs['appointment_time']

        # Check whether the same slot is already booked.
        if Appointment.objects.filter(
            consultant=consultant,
            appointment_date=date,
            appointment_time=time,
            status__in=['pending', 'confirmed']
        ).exists():
            raise serializers.ValidationError(
                'Already Booked a appointment at this datetime '
            )

        # Prevent past dates from being booked.
        from django.utils import timezone
        import datetime
        today = timezone.now().date()
        if date < today:
            raise serializers.ValidationError(
                'Past Date can not be book in a appointment'
            )

        return attrs

    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)


class AppointmentSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    consultant = ConsultantListSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'client', 'consultant',
            'appointment_date', 'appointment_time',
            'session_type', 'status', 'notes',
            'client_message', 'created_at',
        ]


class AppointmentStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['status', 'notes']