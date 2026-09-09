import logging

from rest_framework import generics, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
from core.permissions import IsRoleAdmin
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import F
from .models import Blog, Category, Tag
from .serializers import (
    BlogListSerializer, BlogDetailSerializer,
    BlogCreateUpdateSerializer, CategorySerializer, TagSerializer,
)

logger = logging.getLogger(__name__)


class BlogPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'
    max_page_size = 30


class BlogListView(generics.ListAPIView):
    serializer_class = BlogListSerializer
    permission_classes = [AllowAny]
    pagination_class = BlogPagination
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
        # Increment view count atomically
        Blog.objects.filter(pk=instance.pk).update(views=F('views') + 1)
        instance.refresh_from_db()
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
    permission_classes = [IsRoleAdmin]
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
    permission_classes = [IsRoleAdmin]
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return BlogDetailSerializer
        return BlogCreateUpdateSerializer

    def get_queryset(self):
        return Blog.objects.all()


class AdminTagListCreateView(generics.ListCreateAPIView):
    """Admin-only tag management (used by the editor's tag input)."""
    permission_classes = [IsRoleAdmin]
    queryset = Tag.objects.all().order_by('name')
    serializer_class = TagSerializer

    def perform_create(self, serializer):
        name = (serializer.validated_data.get('name') or '').strip()
        existing = Tag.objects.filter(name__iexact=name).first()
        if existing:
            # Reuse the existing tag instead of failing on a slug collision.
            serializer.instance = existing
        else:
            serializer.save()


class BlogImageUploadView(APIView):
    """Upload an image (cover or rich-text inline) to Cloudinary and return its URL."""
    permission_classes = [IsRoleAdmin]

    def post(self, request):
        image = request.FILES.get('image')
        if not image:
            return Response(
                {'detail': 'No image file provided.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate the file is a real image before sending to Cloudinary.
        try:
            from PIL import Image
            img = Image.open(image)
            img.verify()
            image.seek(0)
        except Exception:
            logger.warning("Uploaded file failed image verification: %s", image.name)
            return Response(
                {'detail': 'Uploaded file is not a valid image.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            import cloudinary.uploader
            result = cloudinary.uploader.upload(
                image,
                folder='blog-images/',
                resource_type='image',
                use_filename=True,
                unique_filename=True,
                allowed_formats=['jpg', 'png', 'gif', 'webp', 'avif'],
            )
        except Exception:
            logger.exception("Blog image upload to Cloudinary failed")
            return Response(
                {'detail': 'Image upload failed. Please try again.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({'url': result.get('secure_url') or result.get('url')})