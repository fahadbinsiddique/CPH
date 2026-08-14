from rest_framework import serializers
from .models import Blog, Category, Tag
from cph_app.serializers import UserSerializer

try:
    import nh3
except ImportError:  # pragma: no cover - install from requirements.txt
    nh3 = None

# Allowlist matching the rich text editor output (TipTap) while stripping
# scripts, event handlers and unknown markup before it is stored/rendered.
_ALLOWED_TAGS = {
    'p', 'br', 'hr', 'strong', 'em', 'u', 's', 'mark',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'pre', 'code', 'span', 'div',
    'ul', 'ol', 'li',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
}

_ALLOWED_ATTRIBUTES = {
    'a': {'href', 'title', 'target','class'},
    'img': {'src', 'alt', 'title', 'width', 'height'},
    'p': {'style'},
    'div': {'style'},
    'blockquote': {'style'},
    'h1': {'style'}, 'h2': {'style'}, 'h3': {'style'},
    'h4': {'style'}, 'h5': {'style'}, 'h6': {'style'},
    'code': {'class'},
    'pre': {'class'},
    'ol': {'start'},
    'td': {'colspan', 'rowspan'}, 'th': {'colspan', 'rowspan'},
}


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

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Content is required.')
        if nh3 is None:
            raise serializers.ValidationError('HTML sanitizer (nh3) is not installed.')
        return nh3.clean(
            value,
            tags=_ALLOWED_TAGS,
            attributes=_ALLOWED_ATTRIBUTES,
            link_rel='noopener noreferrer',
        )

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Title is required.')
        return value.strip()

    def validate_tags(self, value):
        if value is not None and len(value) > 10:
            raise serializers.ValidationError('A post can have at most 10 tags.')
        return value

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