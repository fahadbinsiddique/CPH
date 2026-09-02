from django.urls import path
from .views import (
    AdminConsultantListView,
    AdminConsultantCreateView,
    AdminConsultantUpdateDeleteView,
    AdminConsultantVerifyView,
    AdminSpecializationListCreateView,
    AdminSpecializationDetailView,
)

urlpatterns = [
    path('', AdminConsultantListView.as_view(), name='admin-consultant-list'),
    path('create/', AdminConsultantCreateView.as_view(), name='admin-consultant-create'),
    path('<int:pk>/', AdminConsultantUpdateDeleteView.as_view(), name='admin-consultant-detail'),
    path('<int:pk>/verify/', AdminConsultantVerifyView.as_view(), name='admin-consultant-verify'),

    path('specializations/', AdminSpecializationListCreateView.as_view(), name='admin-specialization-list-create'),
    path('specializations/<int:pk>/', AdminSpecializationDetailView.as_view(), name='admin-specialization-detail'),
]
