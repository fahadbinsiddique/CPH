from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from django.contrib.auth import get_user_model
from .models import Consultant, Specialization, ConsultantAvailability
from cph_app.serializers import UserSerializer # আপনার মেইন অ্যাপের সিরিয়ালাইজার

User = get_user_model()

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ['id', 'name', 'slug']


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultantAvailability
        fields = ['id', 'day', 'start_time', 'end_time', 'session_type']
        
        # নোট: ফ্রন্টএন্ড থেকে সাবমিট করা ডাটা ভিউ-এর মাধ্যমে ইউনিকনেস চেক হবে, 
        # এখানে মডেল লেভেলের গ্লোবাল ভ্যালিডেটর ফ্রন্টএন্ড ডাটার অনুপস্থিতিতে ক্র্যাশ করে।


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
    """ইউজারের বেসিক ডাটা দেখার প্রোফাইল সিরিয়ালাইজার"""
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