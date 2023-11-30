from rest_framework import serializers
from base.api.serializers import MyUserserializer

from ..models import Movie, Rating

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = "__all__"

class RatingSerializer(serializers.ModelSerializer):
    user = MyUserserializer(read_only=True)
    movie = MovieSerializer(read_only=True)

    class Meta:
        model = Rating
        fields = "__all__"