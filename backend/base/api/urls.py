from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from . import views

urlpatterns = [
    path('overview/', views.getRouterOverviewAPIView, name='api-overview'),
    # -------------------------------------------------------------------#
    path('register/', views.RegisterView.as_view(), name="register-account"),
    path('email-verify/', views.VerifyEmailView.as_view(), name="email-verify"),

    path('request-reset-password/', views.RequestPasswordResetByEmail.as_view(), name='request-reset-password'),
    path('pasword-reset/<uidb64>/<token>/', views.PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
    path('reset-password-complete/', views.SetNewPasswordAPIView.as_view(), name='reset-password-complete'),

    # -------------------------------------------------------------------#

    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

]