from rest_framework import serializers
from .models import Blog, Category, Tag
from cph_app.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    blog_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'blog_count']

    def get_blog_count(self, obj):
        return obj.blogs.filter(status='published').count()


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class BlogListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    featured_image = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'excerpt',
            'featured_image', 'author', 'category',
            'tags', 'is_featured', 'views',
            'read_time', 'published_at', 'created_at',
        ]

    def get_featured_image(self, obj):
        if obj.featured_image:
            return obj.featured_image.url
        return None


class BlogDetailSerializer(BlogListSerializer):
    class Meta(BlogListSerializer.Meta):
        fields = BlogListSerializer.Meta.fields + ['content', 'updated_at']


class BlogCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content',
            'featured_image', 'category', 'tags',
            'status', 'is_featured',
        ]

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        blog = Blog.objects.create(
            author=self.context['request'].user,
            **validated_data
        )
        blog.tags.set(tags)
        return blog

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags is not None:
            instance.tags.set(tags)
        return instance