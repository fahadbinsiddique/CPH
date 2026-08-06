from django.urls import path
from .views import (
    # Public / Consultant Views
    ConsultantListView,
    ConsultantDetailView,
    ConsultantCreateView,
    SpecializationListView,
    ConsultantMyAvailabilityView,
    AvailabilityDeleteView,
    
    # Admin Views
    AdminConsultantListView,
    AdminConsultantCreateView,
    AdminConsultantUpdateDeleteView,
    AdminConsultantVerifyView,
    AdminSpecializationListCreateView,
    AdminSpecializationDetailView,
)

urlpatterns = [
    
    # Public & Consultant Routes
    
    path('', ConsultantListView.as_view(), name='consultant-list'),
    path('create/', ConsultantCreateView.as_view(), name='consultant-create'),
    path('specializations/', SpecializationListView.as_view(), name='specialization-list'),
    path('availability/', ConsultantMyAvailabilityView.as_view(), name='availability'),
    path('availability/<int:pk>/', AvailabilityDeleteView.as_view(), name='availability-delete'),

    # Admin — Consultant Management Routes
    
    path('admin/list/', AdminConsultantListView.as_view(), name='admin-consultant-list'),
    path('admin/create/', AdminConsultantCreateView.as_view(), name='admin-consultant-create'),
    path('admin/<int:pk>/', AdminConsultantUpdateDeleteView.as_view(), name='admin-consultant-detail-update-delete'),
    path('admin/<int:pk>/verify/', AdminConsultantVerifyView.as_view(), name='admin-consultant-verify'),

    
    # Admin — Specialization CRUD Routes
    
    path('admin/specializations/', AdminSpecializationListCreateView.as_view(), name='admin-specialization-list-create'),
    path('admin/specializations/<int:pk>/', AdminSpecializationDetailView.as_view(), name='admin-specialization-detail'),

    
    # Dynamic Route (Always keep at the bottom)
    
    path('<slug:slug>/', ConsultantDetailView.as_view(), name='consultant-detail'),
]