from django.urls import path
from .views import (
    ConsultantListView,
    ConsultantDetailView,
    SpecializationListView,
    ConsultantMyAvailabilityView,
    ConsultantCreateView
)

urlpatterns = [
    path('', ConsultantListView.as_view(), name='consultant-list'),

    path('create/', ConsultantCreateView.as_view(), name='consultant-create'),

    # STATIC ROUTES FIRST
    path('specializations/', SpecializationListView.as_view(), name='specialization-list'),
    path('availability/', ConsultantMyAvailabilityView.as_view(), name='availability'),
    
    # DYNAMIC ROUTE LAST
    path('<slug:slug>/', ConsultantDetailView.as_view(), name='consultant-detail'),
]