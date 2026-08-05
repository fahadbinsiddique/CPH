from django.urls import path
from .views import (
    ConsultantListView,
    ConsultantDetailView,
    SpecializationListView,
    ConsultantMyAvailabilityView,
    ConsultantCreateView,
    AvailabilityDeleteView,
    AdminConsultantListView, 
    AdminConsultantVerifyView,
    AdminConsultantCreateView
)

urlpatterns = [
    path('', ConsultantListView.as_view(), name='consultant-list'),

    path('create/', ConsultantCreateView.as_view(), name='consultant-create'),

    # STATIC ROUTES FIRST
    path('specializations/', SpecializationListView.as_view(), name='specialization-list'),
    path('availability/', ConsultantMyAvailabilityView.as_view(), name='availability'),
    
    # DYNAMIC ROUTE LAST
    path('<slug:slug>/', ConsultantDetailView.as_view(), name='consultant-detail'),
    
    path('availability/<int:pk>/', AvailabilityDeleteView.as_view(), name='availability-delete'),

    path('admin/list/', AdminConsultantListView.as_view(), name='admin-consultant-list'),
    path('admin/<int:pk>/verify/', AdminConsultantVerifyView.as_view(), name='admin-consultant-verify'),
    path('admin/create/', AdminConsultantCreateView.as_view(), name='admin-consultant-create'),
]