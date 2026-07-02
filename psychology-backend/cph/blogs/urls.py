from django.urls import path
from .views import (
    BlogListView, BlogDetailView,
    CategoryListView, TagListView,
    FeaturedBlogListView,
    AdminBlogListView, AdminBlogDetailView,
)

urlpatterns = [
    # Public
    path('', BlogListView.as_view(), name='blog-list'),
    path('featured/', FeaturedBlogListView.as_view(), name='blog-featured'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('tags/', TagListView.as_view(), name='tag-list'),
    path('<slug:slug>/', BlogDetailView.as_view(), name='blog-detail'),

    # Admin
    path('admin/list/', AdminBlogListView.as_view(), name='admin-blog-list'),
    path('admin/<int:id>/', AdminBlogDetailView.as_view(), name='admin-blog-detail'),
]