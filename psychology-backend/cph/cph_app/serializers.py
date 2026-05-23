from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.password_validation import validate_password
from cph_app.models import *


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["full_name", "email", "phone_number", "role", "password", "confirm_password"]

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise ValidationError({"confirm_password": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        # ম্যাজিক ট্রিক: যেহেতু USERNAME_FIELD হলো email, তাই ব্যাকগ্রাউন্ডে 
        # ইমেইলের ভ্যালুটাকেই username হিসেবে সেট করে দেওয়া হলো। ফ্রন্টএন্ডের আর প্যারা নাই!
        email = validated_data.get('email')
        validated_data['username'] = email

        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        
        user = authenticate(username=data["username"], password=data["password"])
        
        if not user:
            raise ValidationError("Invalid credential")

        data["user"] = user

        return data


class StudentInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentInfo
        fields = '__all__'
    