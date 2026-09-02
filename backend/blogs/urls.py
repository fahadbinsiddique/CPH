from django.urls import path
from .views import (
    BlogListView, BlogDetailView,
    CategoryListView, TagListView,
    FeaturedBlogListView,
)

urlpatterns = [
    # Public routes
    path('', BlogListView.as_view(), name='blog-list'),
    path('featured/', FeaturedBlogListView.as_view(), name='blog-featured'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('tags/', TagListView.as_view(), name='tag-list'),
    path('<slug:slug>/', BlogDetailView.as_view(), name='blog-detail'),
]
