from django.core.mail import EmailMessage
from django.conf import settings

class Util:
    @staticmethod
    def send_email(data):
        
        email = EmailMessage(subject=data['email_subject'], body=data['email_body'], from_email=settings.EMAIL_HOST_USER, to=[data['email_to']], reply_to=['namlk.personal@gmail.com'])
        email.fail_silently=False
        email.send()