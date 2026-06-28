from rest_framework import generics, filters, status
from rest_framework.permissions import IsAuthenticated
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
    ConsultantCreateSerializer
)

class ConsultantListView(generics.ListAPIView):
    
   # পাবলিক ডিরেক্টরি: এখানে শুধু ভেরিফাইড কনসালট্যান্টরা দেখাবে।
   
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
        
        # সিরিয়ালাইজার ভ্যালিডেশন এবং সেভ ইন্টিগ্রেশন
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
    POST /api/therapists/create/
Any logged-in regular user (client) sending data here will have their role automatically changed to 'consultant', and their profile will be created in the backend.
    """
    serializer_class = ConsultantCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        # ১. ডুপ্লিকেট রিকোয়েস্ট চেক
        if Consultant.objects.filter(user=user).exists():
            raise ValidationError({"detail": "A consultant profile already exists for this user."})

        # ২. রোল আপগ্রেড লজিক
        if user.role == 'client':
            user.role = 'consultant'
            user.save(update_fields=['role'])

        # ৩. প্রোফাইল ডাটা সেভ এবং অবজেক্ট রিটার্ন (যাতে create মেথডে রেসপন্স করা যায়)
        self.instance = serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            
            # perform_create মেথড রান করবে (ডাবল সেভ বাগ ফিক্সড)
            self.perform_create(serializer) 
            
            return Response(
                {
                    "message": "Your profile has been created and account role has been upgraded to Consultant. Awaiting admin approval.",
                    "data": ConsultantDetailSerializer(self.instance).data
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

from rest_framework.permissions import IsAdminUser

class AdminConsultantListView(generics.ListAPIView):
    serializer_class = ConsultantDetailSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Consultant.objects.select_related('user').prefetch_related(
            'specializations', 'availability'
        )


class AdminConsultantVerifyView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            consultant = Consultant.objects.get(pk=pk)
            consultant.is_verified = request.data.get('is_verified', False)
            consultant.save()
            return Response({'status': 'updated'})
        except Consultant.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)