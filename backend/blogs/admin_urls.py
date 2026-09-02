from django.urls import path
from .views import (
    AdminBlogListView, AdminBlogDetailView,
    AdminTagListCreateView, BlogImageUploadView,
)

urlpatterns = [
    path('', AdminBlogListView.as_view(), name='admin-blog-list'),
    path('tags/', AdminTagListCreateView.as_view(), name='admin-tag-list-create'),
    path('upload-image/', BlogImageUploadView.as_view(), name='blog-upload-image'),
    path('<int:id>/', AdminBlogDetailView.as_view(), name='admin-blog-detail'),
]
