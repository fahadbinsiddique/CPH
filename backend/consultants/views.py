from rest_framework import generics, filters, status
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsRoleAdmin
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

from .models import Consultant, Specialization, ConsultantAvailability
from .serializers import (
    ConsultantListSerializer,
    ConsultantDetailSerializer,
    SpecializationSerializer,
    AvailabilitySerializer,
    ConsultantCreateSerializer,
    ConsultantCreateUpdateSerializer,
    SpecializationSerializer,
)

class ConsultantListView(generics.ListAPIView):
    
   # Public directory: only verified consultants are shown here.
   
    serializer_class = ConsultantListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_available', 'specializations__slug', 'location']
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
    permission_classes = []  # Publicly accessible endpoint for registration

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

    def get_queryset(self):
        return Consultant.objects.select_related('user').prefetch_related(
            'specializations', 'availability'
        )


class AdminConsultantVerifyView(APIView):
    permission_classes = [IsRoleAdmin]

    def patch(self, request, pk):
        try:
            consultant = Consultant.objects.get(pk=pk)
            consultant.is_verified = request.data.get('is_verified', False)
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