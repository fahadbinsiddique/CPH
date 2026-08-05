from django.urls import path
from .views import (
    QuizListView, QuizDetailView,
    QuizSubmitView,
    QuizResultListView, QuizResultDetailView,
)

urlpatterns = [
    path('', QuizListView.as_view(), name='quiz-list'),
    path('submit/', QuizSubmitView.as_view(), name='quiz-submit'),
    path('results/', QuizResultListView.as_view(), name='result-list'),
    path('results/<int:pk>/', QuizResultDetailView.as_view(), name='result-detail'),
    path('<slug:slug>/', QuizDetailView.as_view(), name='quiz-detail'),
]