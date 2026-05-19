from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from cph_app.models import *
from cph_app.serializers import *


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes=[]

    def create(self, request, *args, **kwargs):
        serializer= self.get_serializer(data= request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'success':True,
            'message':'Registration Successfull'
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    serializer_class= LoginSerializer
    permission_classes=[]
    
    def post(self, request, *args,**kwargs):
        serializer= self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user= serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        return Response({
            'success': True,
            'message': 'Login Successfull',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'data':{
                'username':user.username,
                "email":user.email,
                'user_type':user.role
            }
        },status=status.HTTP_200_OK)
    

class StudentModelViewSet(ModelViewSet):

    queryset = StudentInfo.objects.all()

    serializer_class = StudentInfoSerializer
    # permission_classes=[IsAuthenticated]
  