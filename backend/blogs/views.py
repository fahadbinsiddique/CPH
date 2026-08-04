from rest_framework import generics, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Blog, Category, Tag
from .serializers import (
    BlogListSerializer, BlogDetailSerializer,
    BlogCreateUpdateSerializer, CategorySerializer, TagSerializer,
)


class BlogListView(generics.ListAPIView):
    serializer_class = BlogListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'tags__slug', 'is_featured']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'views', 'created_at']
    ordering = ['-published_at']

    def get_queryset(self):
        return Blog.objects.filter(
            status='published'
        ).select_related('author', 'category').prefetch_related('tags')


class BlogDetailView(generics.RetrieveAPIView):
    serializer_class = BlogDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Blog.objects.filter(
            status='published'
        ).select_related('author', 'category').prefetch_related('tags')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        Blog.objects.filter(pk=instance.pk).update(views=instance.views + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]


class FeaturedBlogListView(generics.ListAPIView):
    serializer_class = BlogListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Blog.objects.filter(
            status='published', is_featured=True
        ).select_related('author', 'category').prefetch_related('tags')[:6]


# Admin blog management
class AdminBlogListView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'status']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BlogCreateUpdateSerializer
        return BlogListSerializer

    def get_queryset(self):
        return Blog.objects.all().select_related(
            'author', 'category'
        ).prefetch_related('tags')

    def perform_create(self, serializer):
        serializer.save()


class AdminBlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return BlogDetailSerializer
        return BlogCreateUpdateSerializer

    def get_queryset(self):
        return Blog.objects.all()