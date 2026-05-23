from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from cph_app.models import *
from cph_app.serializers import *


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes=[AllowAny]

    def create(self, request, *args, **kwargs):
        serializer= self.get_serializer(data= request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # ১. সিরিয়ালাইজার ডাটা সেভ করে ডেটাবেসের ইউজার অবজেক্ট 
        user = serializer.save()
        
        # ২. রেসপন্স (পাসওয়ার্ড ছাড়া, ডেটাবেস থেকে আসা আসল ডাটা)
        return Response({
            'success': True,
            'message': 'Registration Successful',
            'user': {
                'id': user.id,
                'full_name': user.full_name,
                'email': user.email,
                'role': user.role
            }
        }, status=status.HTTP_201_CREATED)
    

class LoginView(generics.GenericAPIView):
    serializer_class= LoginSerializer
    permission_classes=[]
    
    def post(self, request, *args,**kwargs):
        serializer= self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user= serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        response = Response({
            'success': True,
            'message': 'Login Successful',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'data': {
                'username': user.username,
                'email': user.email,
                'user_type': user.role
            }
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key='access_token',
            value=str(refresh.access_token),
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=86400
        )

        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=7 * 24 * 60 * 60
        )

        return response
    

class StudentModelViewSet(ModelViewSet):

    queryset = StudentInfo.objects.all()

    serializer_class = StudentInfoSerializer
    
    permission_classes=[IsAuthenticated]

class LogoutView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self, request):
        try:
            refresh_token= request.COOKIES.get('refresh_token')
            if refresh_token:
              token= RefreshToken(refresh_token)
              token.blacklist()

            response= Response({
               "success": True,
                "message": "Logout successful"
            },status=status.HTTP_200_OK)

            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response
        
        except Exception as e:
            return Response({
                'Success': False,
                "message":'Invalid refresh token'
            },status=status.HTTP_400_BAD_REQUEST)

  