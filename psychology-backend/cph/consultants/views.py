from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Consultant, Specialization, ConsultantAvailability
from .serializers import (
    ConsultantListSerializer,
    ConsultantDetailSerializer,
    SpecializationSerializer,
    AvailabilitySerializer,
)


class ConsultantListView(generics.ListAPIView):
    serializer_class = ConsultantListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_available', 'is_verified', 'specializations__slug']
    search_fields = ['user__full_name', 'bio', 'location', 'languages']
    ordering_fields = ['consultation_fee', 'experience_years', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Consultant.objects.filter(
            is_verified=True
        ).select_related('user').prefetch_related('specializations')


class ConsultantDetailView(generics.RetrieveAPIView):
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        consultant = Consultant.objects.get(user=request.user)
        serializer = AvailabilitySerializer(
            consultant.availability.all(), many=True
        )
        return Response(serializer.data)

    def post(self, request):
        consultant = Consultant.objects.get(user=request.user)
        serializer = AvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(consultant=consultant)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)