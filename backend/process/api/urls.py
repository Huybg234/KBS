from django.urls import path
from . import views

urlpatterns = [
    path('get-movies-collab/', views.getMoviesCollaborative, name='get-movies-collab'),
    path('get-movies-content/<str:movieId>/', views.getMoviesContentBase, name='get-movies-content'),
    path('search/', views.SearchMovie, name='search'),
    path('rating/', views.RatingMoive, name='rating'),
    path('movie/<str:id>/', views.MovieDetail, name='movie-detail'),
    path('get-rating/', views.getRating, name='get-rating'),
]