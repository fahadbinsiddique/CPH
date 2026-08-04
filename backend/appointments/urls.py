from django.urls import path
from .views import (
    AppointmentCreateView,
    AppointmentListView,
    AppointmentDetailView,
    AppointmentStatusUpdateView,
    BookedSlotsView,
    AdminStatsView
)

urlpatterns = [
    path('', AppointmentListView.as_view(), name='appointment-list'),
    path('create/', AppointmentCreateView.as_view(), name='appointment-create'),
    path('<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
    path('<int:pk>/status/', AppointmentStatusUpdateView.as_view(), name='appointment-status'),
    path('booked-slots/<int:consultant_id>/', BookedSlotsView.as_view(), name='booked-slots'),

     path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
]