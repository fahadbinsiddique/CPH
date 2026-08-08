from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Quiz, QuizResult
from .serializers import (
    QuizListSerializer, QuizDetailSerializer,
    QuizSubmitSerializer, QuizResultSerializer,
)


class QuizListView(generics.ListAPIView):
    serializer_class = QuizListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Quiz.objects.filter(is_active=True)


class QuizDetailView(generics.RetrieveAPIView):
    serializer_class = QuizDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Quiz.objects.filter(
            is_active=True
        ).prefetch_related('questions__options', 'score_ranges')


class QuizSubmitView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = QuizSubmitSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user if request.user.is_authenticated else None
            result = serializer.save(user=user)
            return Response(
                QuizResultSerializer(result).data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class QuizResultListView(generics.ListAPIView):
    serializer_class = QuizResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizResult.objects.filter(
            user=self.request.user
        ).select_related('quiz', 'score_range')


class QuizResultDetailView(generics.RetrieveAPIView):
    serializer_class = QuizResultSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return QuizResult.objects.select_related('quiz', 'score_range')