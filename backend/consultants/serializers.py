from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from django.contrib.auth import get_user_model
from .models import Consultant, Specialization, ConsultantAvailability
from cph_app.serializers import UserSerializer
from django.db import transaction
from config.email_utils import send_consultant_welcome_email  # Resend function import

User = get_user_model()

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ['id', 'name', 'slug']


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultantAvailability
        fields = ['id', 'day', 'start_time', 'end_time', 'session_type']
        
        # Note: uniqueness is validated in the view layer when data is submitted from the frontend.


class ConsultantListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    specializations = SpecializationSerializer(many=True, read_only=True)
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Consultant
        fields = [
            'id', 'slug', 'user', 'specializations',
            'experience_years', 'consultation_fee',
            'profile_image', 'is_verified', 'is_available',
            'languages', 'location',
        ]

    def get_profile_image(self, obj):
        if obj.profile_image:
            return obj.profile_image.url
        return None


class ConsultantDetailSerializer(ConsultantListSerializer):
    availability = AvailabilitySerializer(many=True, read_only=True)

    class Meta(ConsultantListSerializer.Meta):
        fields = ConsultantListSerializer.Meta.fields + ['bio', 'availability', 'created_at']


class UserProfileSerializer(serializers.ModelSerializer):
    """Basic profile serializer for viewing user data."""
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'phone_number', 'role']
        read_only_fields = fields


class ConsultantCreateSerializer(serializers.ModelSerializer):
    specializations = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Specialization.objects.all(), required=False
    )

    class Meta:
        model = Consultant
        fields = [
            'bio', 'experience_years', 'consultation_fee', 
            'profile_image', 'languages', 'location', 'specializations'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        
        specializations = validated_data.pop('specializations', [])
        consultant = Consultant.objects.create(**validated_data)
        consultant.specializations.set(specializations)
        return consultant



class AdminConsultantCreateSerializer(serializers.ModelSerializer):
    # creating user object neccesry fields
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=6)
    full_name = serializers.CharField(write_only=True, required=False)

    specializations = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Specialization.objects.all(), required=False
    )

    class Meta:
        model = Consultant
        fields = [
            'email', 'password', 'full_name',
            'bio', 'experience_years', 'consultation_fee', 
            'profile_image', 'languages', 'location', 
            'specializations', 'is_verified'
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        # save request.data to variable
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        full_name = validated_data.pop('full_name', '')
        specializations = validated_data.pop('specializations', [])

        # ২. User create (role = 'consultant')
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            full_name=full_name,
            role='consultant'
        )

        # ৩. Consultant Profile 
        consultant = Consultant.objects.create(user=user, **validated_data)
        
        transaction.on_commit(
            lambda: send_consultant_welcome_email(
                to_email=email,
                full_name=full_name,
                temp_password=password
            )
        )

        if specializations:
            consultant.specializations.set(specializations)

        # 4. Send Welcome Email with temporary login credentials via Resend
        
        return consultant