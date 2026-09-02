from rest_framework import generics, filters, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.throttling import ScopedRateThrottle
from core.permissions import IsRoleAdmin
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from .models import Consultant, Specialization, ConsultantAvailability
from .serializers import (
    ConsultantListSerializer,
    ConsultantDetailSerializer,
    SpecializationSerializer,
    AvailabilitySerializer,
    ConsultantCreateSerializer,
    ConsultantCreateUpdateSerializer,
    ConsultantMeSerializer,
    SpecializationSerializer,
)

class ConsultantListView(generics.ListAPIView):
    
   # Public directory: only verified consultants are shown here.
   
    serializer_class = ConsultantListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_available', 'is_featured' ,'specializations__slug', 'location']
    search_fields = ['user__full_name', 'bio', 'location', 'languages']
    ordering_fields = ['consultation_fee', 'experience_years', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Consultant.objects.filter(
            is_verified=True
        ).select_related('user').prefetch_related('specializations')


class ConsultantDetailView(generics.RetrieveAPIView):
    
    """"
    Details of any single consultant (public or own profile)
    
    """

    serializer_class = ConsultantDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Consultant.objects.select_related('user').prefetch_related(
            'specializations', 'availability'
        )


class ConsultantAvailabilityView(APIView):
    """
    Public endpoint to check a consultant's available slots for a specific date.

    GET /api/consultants/<slug>/availability/?date=2026-09-01

    Returns available time slots for the given date, excluding already booked slots.
    """
    permission_classes = [AllowAny]

    def get(self, request, slug):
        consultant = get_object_or_404(
            Consultant.objects.select_related('user'),
            slug=slug,
            is_verified=True
        )

        date_str = request.query_params.get('date')
        if not date_str:
            return Response(
                {'error': 'date query parameter is required (YYYY-MM-DD)'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            from datetime import datetime as dt
            target_date = dt.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        day_name = target_date.strftime('%A').lower()

        availability_slots = ConsultantAvailability.objects.filter(
            consultant=consultant,
            day=day_name
        )

        if not availability_slots.exists():
            return Response({
                'consultant': consultant.slug,
                'date': date_str,
                'day': day_name,
                'available_slots': [],
                'message': 'Consultant is not available on this day.'
            })

        from datetime import datetime, timedelta
        from appointments.models import Appointment

        booked_times = set(
            Appointment.objects.filter(
                consultant=consultant,
                appointment_date=target_date,
                status__in=['pending', 'confirmed']
            ).values_list('appointment_time', flat=True)
        )

        available_slots = []
        for avail in availability_slots:
            start_dt = datetime.combine(target_date, avail.start_time)
            end_dt = datetime.combine(target_date, avail.end_time)
            current = start_dt

            while current + timedelta(minutes=30) <= end_dt:
                slot_time = current.time()
                is_booked = any(
                    bt.hour == slot_time.hour and bt.minute == slot_time.minute
                    for bt in booked_times
                )

                if not is_booked:
                    available_slots.append({
                        'start_time': current.strftime('%H:%M'),
                        'end_time': (current + timedelta(minutes=30)).strftime('%H:%M'),
                        'session_type': avail.session_type,
                    })

                current += timedelta(minutes=30)

        return Response({
            'consultant': consultant.slug,
            'date': date_str,
            'day': day_name,
            'available_slots': available_slots,
        })


class ConsultantMeView(APIView):
    """
    Authenticated "become a consultant" flow.

    GET  /api/consultants/me/  -> whether the current user has a profile.
    POST /api/consultants/me/  -> create or update the current user's consultant
                                  profile (upsert). Never creates a second user;
                                  a 'client' role is upgraded to 'consultant'.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        consultant = Consultant.objects.filter(user=request.user).first()
        if consultant is None:
            return Response({'has_profile': False, 'data': None})
        serializer = ConsultantDetailSerializer(consultant)
        return Response({'has_profile': True, 'data': serializer.data})

    def post(self, request):
        consultant = Consultant.objects.filter(user=request.user).first()
        created = consultant is None

        serializer = ConsultantMeSerializer(
            instance=consultant,
            data=request.data,
            partial=True,
            context={'user': request.user},
        )
        serializer.is_valid(raise_exception=True)
        consultant = serializer.save()

        # Upgrade a plain client account to consultant on first profile creation.
        if request.user.role == 'client':
            request.user.role = 'consultant'
            request.user.save(update_fields=['role'])

        return Response(
            {
                "message": (
                    "Your consultant profile has been created. Awaiting admin approval."
                    if created
                    else "Your consultant profile has been updated."
                ),
                "data": ConsultantDetailSerializer(consultant).data,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class SpecializationListView(generics.ListAPIView):
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer


class ConsultantMyAvailabilityView(APIView):
    """
    Free time slot management for the doctor's own dashboard (Upsert logic)
    """
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Consultant, user=self.request.user)

    def get(self, request):
        consultant = self.get_object()
        serializer = AvailabilitySerializer(
            consultant.availability.all(), many=True
        )
        return Response(serializer.data)

    def post(self, request):
        consultant = self.get_object()
        day = request.data.get('day')
        
        if not day:
            raise ValidationError({"day": "This field is required."})

        availability_instance = ConsultantAvailability.objects.filter(consultant=consultant, day=day).first()
        
        # Validate the serializer and save the availability data.
        if availability_instance:
            serializer = AvailabilitySerializer(availability_instance, data=request.data, partial=True)
        else:
            serializer = AvailabilitySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(consultant=consultant)
            return Response(
                serializer.data, 
                status=status.HTTP_200_OK if availability_instance else status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ConsultantCreateView(generics.CreateAPIView):
    """
    POST /api/consultant/register/
    Public Endpoint: Anyone can register directly as a Consultant along with user creation.
    """
    serializer_class = ConsultantCreateSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'auth_action'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            consultant = serializer.save()
            
            return Response(
                {
                    "message": "Your consultant account and profile have been created successfully. Awaiting admin approval.",
                    "data": ConsultantDetailSerializer(consultant).data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AvailabilityDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ConsultantAvailability.objects.filter(
            consultant__user=self.request.user
        )


class AdminConsultantListView(generics.ListAPIView):
    serializer_class = ConsultantDetailSerializer
    permission_classes = [IsRoleAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_verified', 'is_available', 'specializations__slug']
    search_fields = ['user__full_name', 'user__email', 'location']
    ordering_fields = ['created_at', 'experience_years', 'consultation_fee']
    ordering = ['-created_at']

    def get_queryset(self):
        return Consultant.objects.select_related('user').prefetch_related(
            'specializations', 'availability'
        )


class AdminConsultantVerifyView(APIView):
    permission_classes = [IsRoleAdmin]

    def patch(self, request, pk):
        try:
            consultant = Consultant.objects.get(pk=pk)
            is_verified = request.data.get('is_verified', False)
            consultant.is_verified = is_verified
            consultant.user.role = 'consultant' if is_verified else 'client'
            consultant.user.save(update_fields=['role'])
            consultant.save()
            return Response({'status': 'updated'})
        except Consultant.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)


# Admin — Consultant Management Views

class AdminConsultantCreateView(generics.CreateAPIView):
    serializer_class = ConsultantCreateUpdateSerializer
    permission_classes = [IsRoleAdmin] 

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        consultant = serializer.save()

        return Response(
            {
                "message": "Consultant account and profile created successfully.",
                "data": ConsultantDetailSerializer(consultant).data
            },
            status=status.HTTP_201_CREATED
        )


class AdminConsultantUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsRoleAdmin]
    queryset = Consultant.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return ConsultantDetailSerializer
        return ConsultantCreateUpdateSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = instance.user
        response = super().destroy(request, *args, **kwargs)
        
        if user:
            user.delete()
        return response



# Admin — Specialization CRUD Views


class AdminSpecializationListCreateView(generics.ListCreateAPIView):
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    permission_classes = [IsRoleAdmin]


class AdminSpecializationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    permission_classes = [IsRoleAdmin]