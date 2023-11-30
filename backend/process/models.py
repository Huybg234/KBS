from django.db import models
from base.models import User

# Create your models here.

class Movie(models.Model):
    movieId = models.IntegerField(null=True, blank=True)
    title = models.TextField(max_length=100, null=True, blank=True)
    genres = models.TextField(max_length=200, null=True, blank=True)
    description = models.TextField(max_length=500, null=True, blank=True)
    poster_url = models.CharField(max_length=100, null=True, blank=True)
    rating_average = models.FloatField(null=True, default=0, blank=True)
    class Meta:
        pass
    def __str__(self):
        return self.title    

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    rating = models.FloatField(null=True, blank=True, default=0)

    class Meta:
        pass
    def __str__(self):
        return f"{self.user.username} - {self.movie.title} - {self.movie.movieId}: {self.rating}" 