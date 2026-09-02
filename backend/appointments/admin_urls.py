from django.urls import path
from .views import AdminStatsView, AdminAnalyticsView

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
]
