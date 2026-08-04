from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError

from rest_framework import serializers
from cph_app.models import *

User = get_user_model()


# Register serializer.
  
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, )
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "full_name",
            "email",
            "phone_number",
            "role",
            "password",
            "confirm_password",
        ]
        extra_kwargs = {
            "role": {"read_only": True}
        }

    def validate(self, data):
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if password != confirm_password:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match"}
            )

        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        # Set the email address as the username because USERNAME_FIELD uses email.
        email = validated_data.get("email")
        validated_data["username"] = email

        user = User.objects.create_user(**validated_data)
        return user


  
# Login serializer.
  
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        
        user = authenticate(username=data["username"], password=data["password"])
        
        if not user:
            raise ValidationError("Invalid credential")

        data["user"] = user

        return data


  
# User serializer for public profile data.
  
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "email",
            "phone_number",
            "role",
            "created_at",
        ]



