import re
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from django.contrib.auth import get_user_model
from .models import Consultant, Specialization, ConsultantAvailability
from cph_app.serializers import UserSerializer
from django.utils.text import slugify
from django.db import transaction, IntegrityError
from config.email_utils import (
    send_consultant_welcome_email_async,  # admin-created consultant
    send_consultant_application_received_email_async,  # self-registration
)

BD_PHONE_REGEX = re.compile(r'^(\+88|88)?01[3-9]\d{8}$')


def _normalize_phone(value):
    return value.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')

User = get_user_model()


def _unique_slug_from_name(name, exclude_pk=None):
    """
    Build a unique slug for a specialization name.

    The ``slug`` column is ``unique=True``, so ``slugify(name)`` on its own can
    collide (e.g. two "Anxiety" entries, or "Anxiety" vs "Anxiety "). Sequential
    numeric suffixes keep duplicates readable and stable.
    """
    base = slugify(name) or 'specialization'
    counter = 0
    while True:
        candidate = base if counter == 0 else f"{base}-{counter}"
        qs = Specialization.objects.filter(slug=candidate)
        if exclude_pk is not None:
            qs = qs.exclude(pk=exclude_pk)
        if not qs.exists():
            return candidate
        counter += 1


class SpecializationSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)
    class Meta:
        model = Specialization
        fields = ['id', 'name', 'slug']

    def create(self, validated_data):
        # auto slug generate from name, collision-safe
        name = validated_data.get('name')
        for _ in range(10):
            validated_data['slug'] = _unique_slug_from_name(name)
            try:
                # Savepoint-contained insert: an IntegrityError must not abort
                # an enclosing transaction (e.g. the test suite's).
                with transaction.atomic():
                    return super().create(validated_data)
            except IntegrityError:
                # Extremely rare race: another request grabbed this slug first.
                continue
        raise serializers.ValidationError(
            {'name': 'Could not create a unique slug for this name.'}
        )

    def update(self, instance, validated_data):
        # name update auto slug update, collision-safe
        if 'name' in validated_data:
            for _ in range(10):
                validated_data['slug'] = _unique_slug_from_name(
                    validated_data['name'], exclude_pk=instance.pk
                )
                try:
                    with transaction.atomic():
                        return super().update(instance, validated_data)
                except IntegrityError:
                    continue
            raise serializers.ValidationError(
                {'name': 'Could not create a unique slug for this name.'}
            )
        return super().update(instance, validated_data)


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
    # User Model Fields
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=6)
    full_name = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(
        write_only=True, required=False, allow_blank=True, max_length=20
    )

    # Consultant Model Fields
    specializations = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Specialization.objects.all(), required=False
    )

    class Meta:
        model = Consultant
        fields = [
            'email', 'password', 'full_name', 'phone_number',
            'bio', 'experience_years', 'consultation_fee', 
            'profile_image', 'languages', 'location', 'specializations'
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return value

    def validate_phone_number(self, value):
        if not value:
            return value
        if not BD_PHONE_REGEX.fullmatch(_normalize_phone(value)):
            raise serializers.ValidationError(
                "Enter a valid Bangladeshi phone number (e.g. 01XXXXXXXXX or +8801XXXXXXXXX)."
            )
        return value

    def validate_specializations(self, value):
        # Matches the frontend form, which requires at least one specialization.
        if not value:
            raise serializers.ValidationError(
                "Select at least one specialization."
            )
        return value

    @transaction.atomic
    def create(self, validated_data):
        # Extract User attributes
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        full_name = validated_data.pop('full_name')
        phone_number = validated_data.pop('phone_number', '')
        specializations = validated_data.pop('specializations', [])

        # 1. Create User with role 'consultant'
        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                full_name=full_name,
                phone_number=phone_number,
                role='consultant'
            )
        except IntegrityError:
            raise serializers.ValidationError(
                {'email': 'A user with this email address already exists.'}
            )

        # 2. Create Consultant Profile
        consultant = Consultant.objects.create(user=user, **validated_data)

        # 3. Set Many-To-Many Specializations
        if specializations:
            consultant.specializations.set(specializations)

        # 4. Trigger application-received notification after DB commit.
        #    Non-blocking: the 201 response is returned without waiting on Resend.
        transaction.on_commit(
            lambda: send_consultant_application_received_email_async(
                to_email=email,
                full_name=full_name,
            )
        )

        return consultant



class ConsultantCreateUpdateSerializer(serializers.ModelSerializer):
    
    email = serializers.EmailField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, min_length=6, required=False)
    full_name = serializers.CharField(write_only=True, required=False)

    specializations = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Specialization.objects.all(), required=False
    )

    class Meta:
        model = Consultant
        fields = [
            'id', 'email', 'password', 'full_name',
            'specializations', 'bio', 'experience_years',
            'consultation_fee', 'profile_image',
            'is_verified', 'is_available',
            'languages', 'location',
        ]

    def validate_email(self, value):
        
        if not self.instance and User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, attrs):
        
        if not self.instance:
            if not attrs.get('email'):
                raise serializers.ValidationError({'email': 'Email is required for creating a consultant.'})
            if not attrs.get('password'):
                raise serializers.ValidationError({'password': 'Password is required for creating a consultant.'})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        full_name = validated_data.pop('full_name', '')
        specializations = validated_data.pop('specializations', [])

        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                full_name=full_name,
                role='consultant'
            )
        except IntegrityError:
            raise serializers.ValidationError(
                {'email': 'A user with this email address already exists.'}
            )

        
        consultant = Consultant.objects.create(user=user, **validated_data)

        if specializations:
            consultant.specializations.set(specializations)

        # Trigger credentials email after DB commit (admin-created consultant).
        # Non-blocking: the 201 response is returned without waiting on Resend.
        transaction.on_commit(
            lambda: send_consultant_welcome_email_async(
                to_email=email,
                full_name=full_name,
                temp_password=password
            )
        )

        return consultant

    def update(self, instance, validated_data):
       
        validated_data.pop('full_name', None)
        validated_data.pop('email', None)
        validated_data.pop('password', None)
        
        specializations = validated_data.pop('specializations', None)

        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if specializations is not None:
            instance.specializations.set(specializations)

        return instance


class ConsultantMeSerializer(serializers.ModelSerializer):
    """
    Authenticated "become a consultant" flow.

    Upgrades the *current* user (never creates a second account) by creating or
    updating their consultant profile. User identity comes from the JWT/cookie,
    so no email/password/full_name fields are needed here.
    """
    specializations = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Specialization.objects.all(), required=False
    )

    class Meta:
        model = Consultant
        fields = [
            'specializations', 'bio', 'experience_years',
            'consultation_fee', 'profile_image',
            'languages', 'location', 'is_available',
        ]

    def create(self, validated_data):
        user = self.context.get('user')
        specializations = validated_data.pop('specializations', [])
        consultant = Consultant(user=user, is_verified=False, **validated_data)
        consultant.save()
        if specializations:
            consultant.specializations.set(specializations)
        return consultant