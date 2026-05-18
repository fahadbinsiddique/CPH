from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from cph_app.models import *
from cph_app.serializers import *





class StudentModelViewSet(ModelViewSet):

    queryset = StudentInfo.objects.all()

    serializer_class = StudentInfoSerializer

class UserModelViewSet(ModelViewSet):

    queryset = User.objects.all()

    serializer_class = UserSerializer