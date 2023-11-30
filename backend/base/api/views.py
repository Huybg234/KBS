from rest_framework.response import Response
from rest_framework import status, generics, views
from rest_framework.decorators import api_view

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
import jwt

from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from django.http import HttpResponseRedirect

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str,force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode


from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

import os

from .utils import Util
from ..models import User
from .serializers import RegisterSerializer, EmailVerificationSerializer, ResetPasswordEmailRequestSerializer, SetNewPasswordSerializer



#------------------------------OVERVIEW API-------------------------------#
@api_view(["GET"])
def getRouterOverviewAPIView(request):
    apiOverview = {
        'api/todos/': 'method: POST, GET',
        'api/todo/<id>/': 'method: DELETE, PUT, PATCH, GET',
        'api/token': 'method: POST',
        'api/token/refresh': 'method: POST',
    }
    print(os.environ.get('EMAIL_HOST_USER'), os.environ.get('EMAIL_HOST_PASSWORD'))
    return Response(apiOverview)

#--------------------------------API FOR USER DATA -----------------------------#

# class RegisterUserView(generics.GenericAPIView):
#     serializer_class = MyUserserializer

#     def post(self, request):
#         serializer = self.serializer_class(data=request.data)
#         data = {}
#         if serializer.is_valid():
#             user = serializer.save()
#             data['response'] = "successfully register a new user!"
#             data['id'] = user.id
#             data['email'] = user.email
#             data['username'] = user.username
#             return Response(data, status=status.HTTP_201_CREATED)
#         else:
#             data = serializer.errors
#             return Response(data, status=status.HTTP_400_BAD_REQUEST) 

#-------------------------API FOR USER DATA------------------------------------#

class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        user = User.objects.get(email=serializer.data['email'])
        token = RefreshToken.for_user(user).access_token

        current_site = get_current_site(request).domain
        relativeLink = reverse('email-verify')
        absUrl = 'http://' + current_site + relativeLink + "?token=" + str(token)

        email_body = f"Hi {str(request.data['username'])}.\nUse link below to verify your email:\n" + absUrl
        
        data = {'email_body': email_body, 'email_subject': 'Verify your email', 'email_to': user.email}
        Util.send_email(data)

        return Response(serializer.data, status=status.HTTP_201_CREATED) 


class VerifyEmailView(views.APIView):

    serializer_class = EmailVerificationSerializer

    token_param_config = openapi.Parameter('token', in_=openapi.IN_QUERY, description='description', type=openapi.TYPE_STRING)

    @swagger_auto_schema(manual_parameters=[token_param_config])
    def get(self, request):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            try:
                user = User.objects.get(id=payload['user_id'])
            except:
                return Response({'message': 'user account was deleted. Please create a new account!'}, status=status.HTTP_400_BAD_REQUEST)
                
            if not user.is_verified:
                user.is_verified = True
                user.save()
            return HttpResponseRedirect(redirect_to=f"{os.environ.get('FRONT_END_URL')}/login/?verified={True}")
            # return Response({'email': 'Successfully activated'}, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError as identifier:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'], options={"verify_signature": False})
            user = User.objects.get(id=payload['user_id'])

            token = RefreshToken.for_user(user).access_token
            current_site = get_current_site(request).domain
            relativeLink = reverse('email-verify')
            absUrl = 'http://' + current_site + relativeLink + "?token=" + str(token)
            email_body = f"Hi {str(user.username)}.\nUse link below to verify your email:\n" + absUrl
            data = {'email_body': email_body, 'email_subject': 'Reverify your email', 'email_to': user.email}
            Util.send_email(data)

            return HttpResponseRedirect(redirect_to=f"{os.environ.get('FRONT_END_URL')}/login/?verified={False}")
            # return Response({'error': 'Activation Expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError as identifier:
            return HttpResponseRedirect(redirect_to=f"{os.environ.get('FRONT_END_URL')}/login/?verified={'Error'}")
            # return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class RequestPasswordResetByEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data = request.data)
        
        email = request.data.get('email', '')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = get_current_site(request).domain
            relativeLink = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            absurl = 'http://' + current_site + relativeLink 
            email_body = f"Hello, \nUse link below to reset your password \n{absurl}"
            data = {'email_body': email_body, 'email_subject': 'Reset your password', 'email_to': user.email}
            Util.send_email(data)
            return Response({'success': 'We have sent you a link to reset password'}, status=status.HTTP_200_OK)
        return Response({"error":'email has not yet registered any account.'}, status=status.HTTP_401_UNAUTHORIZED)

class PasswordTokenCheckAPI(generics.GenericAPIView):

    serializer_class = ResetPasswordEmailRequestSerializer
    def get(self, request, uidb64, token):

        try: 
            id=smart_str(urlsafe_base64_decode((uidb64)))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return HttpResponseRedirect(redirect_to=f"{os.environ.get('FRONT_END_URL')}/reset-password/?token-verified=INVALID")
                # return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)
            return HttpResponseRedirect(redirect_to=f"{os.environ.get('FRONT_END_URL')}/reset-password/?uidb64={uidb64}&token={token}")
            # return Response({'success': True,  'message': 'Credentials valid', 'uidb64': uidb64, 'token': token}, status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError as identifier:
            return HttpResponseRedirect(redirect_to=f"{os.environ.get('FRONT_END_URL')}/reset-password/?token-verified=INVALID")
            # return Response({"error":'Token is not valid, please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)

    
class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serialize = self.serializer_class(data=request.data)
        serialize.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Reset password acepted'}, status=status.HTTP_200_OK)

#----------------------------API FOR TOKEN---------------------------------#
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['is_verified'] = user.is_verified
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer