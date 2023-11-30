from multiprocessing import AuthenticationError
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.encoding import force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from ..models import User
MyUser = get_user_model()

class MyUserserializer(serializers.ModelSerializer):
    # password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = MyUser
        fields = ['id', 'email', 'username']
        # extra_kwargs = {
        #     'password':{'write_only': True}
        # }

    # def save(self):
    #     account = MyUser(
    #         email=self.validated_data['email'],
    #         username=self.validated_data['username'],
    #     )
    #     password = self.validated_data['password']
    #     password2 = self.validated_data['password2']

    #     if password != password2:
    #         raise serializers.ValidationError({'password':'Password must match.'})
    #     account.set_password(password)
    #     account.save()
    #     return account


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=8, write_only=True)

    class Meta: 
        model = User
        fields = ['email', 'username', 'password']

    def validate(self, attrs):
        email = attrs.get('email', '')
        username = attrs.get('username', '')

        if not username.isalnum():
            raise serializers.ValidationError(
                'The username should only contain alphanumberic characters'
            )

        return attrs
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class EmailVerificationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=555)

    class Meta:
        model = User
        fields = ['token']

class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.CharField(min_length=2)
    # redirect_url = serializers.CharField(max_length=500, required=False)
    
    class Meta:
        fields = ['email']


class SetNewPasswordSerializer(serializers.Serializer):
    password=serializers.CharField(min_length=8, max_length=88, write_only=True)
    token=serializers.CharField(min_length=1, write_only=True)
    uidb64=serializers.CharField(min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')
            id = force_str(urlsafe_base64_decode(uidb64))
            user= User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationError('The reset link is invalid', 401)

            user.set_password(password)
            user.save()

            return (user)

        except Exception as e:
            raise AuthenticationError('The reset link is invalid', 401)
        return super().validate(attrs)