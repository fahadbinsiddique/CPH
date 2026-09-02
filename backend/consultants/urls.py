from django.urls import path
from .views import (
    ConsultantListView,
    ConsultantDetailView,
    ConsultantAvailabilityView,
    ConsultantCreateView,
    ConsultantMeView,
    SpecializationListView,
    ConsultantMyAvailabilityView,
    AvailabilityDeleteView,
)

urlpatterns = [
    path('', ConsultantListView.as_view(), name='consultant-list'),
    path('create/', ConsultantCreateView.as_view(), name='consultant-create'),
    path('specializations/', SpecializationListView.as_view(), name='specialization-list'),
    path('availability/', ConsultantMyAvailabilityView.as_view(), name='availability'),
    path('availability/<int:pk>/', AvailabilityDeleteView.as_view(), name='availability-delete'),
    path('me/', ConsultantMeView.as_view(), name='consultant-me'),

    # Dynamic Route (Always keep at the bottom)
    path('<slug:slug>/', ConsultantDetailView.as_view(), name='consultant-detail'),
    path('<slug:slug>/availability/', ConsultantAvailabilityView.as_view(), name='consultant-availability'),
]