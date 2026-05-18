from rest_framework import serializers
from cph_app.models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields= '__all__'

class StudentInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentInfo
        fields = '__all__'