import pandas as pd
from numpy import load
from .utils import Util
from django.contrib.auth import get_user_model
User  = get_user_model()
 
data = pd.read_csv('dataset/movies_data_final.csv')

dict_data_for_content = load('dataset/matrix.npz')
vectors = dict_data_for_content['arr_0']

dict_data_similarity_content = load('dataset/similarity.npz')
similarity_content = dict_data_similarity_content['arr_0']

dictionary = pd.read_csv('dataset/dictionary.csv')

dict_data_for_colab = load('dataset/corrMatrix.npz')
corrMatrix = dict_data_for_colab['arr_0']

columns_name = pd.read_csv('dataset/columns_name.csv')
corrMatrix = pd.DataFrame(corrMatrix, columns=columns_name['movieId'].tolist(), index=columns_name['movieId'].tolist())


from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.decorators import  permission_classes, api_view
from django.db.models import Q

from ..models import Movie, Rating
from .serializers import MovieSerializer, RatingSerializer

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def getMoviesCollaborative(request):
    user = request.user
    ratings = Rating.objects.filter(user = user)
    list_movie_recommend_json = []
    if len(ratings) > 0:
        list_rating = []
        for i in ratings:
            list_rating.append((i.movie.movieId, i.rating))
        list_movie_recommend = Util.recommend_collabrative_filtering(list_rating, corrMatrix, data, similarity_content)
        for i in list_movie_recommend:
            list_movie_recommend_json.append({'movieId': i.movieId, 'title': i.title, 'genres': i.genres, 'description': i.overview, 'poster_url': i.poster_url, 'rating_average': i.rating})
        return Response(list_movie_recommend_json, status=status.HTTP_200_OK)
    else:
        movies = Movie.objects.all().order_by('-rating_average')[0:20]
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def getMoviesContentBase(request, movieId):
    list_movie_recommend = Util.recommend_content_base_id(similarity_content, data, int(movieId))
    list_movie_recommend_json = []
    for i in list_movie_recommend:
            list_movie_recommend_json.append({'movieId': i.movieId, 'title': i.title, 'genres': i.genres, 'description': i.overview, 'poster_url': i.poster_url, 'rating_average': i.rating})
    return Response(list_movie_recommend_json, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def SearchMovie(request):
    list_movie_recommend_json = []
    list_movie_recommend = Util.recommend_content_base_name(request.data.get('search') , vectors, data)
    for i in list_movie_recommend:
        list_movie_recommend_json.append({'movieId': i.movieId, 'title': i.title, 'genres': i.genres, 'description': i.overview, 'poster_url': i.poster_url, 'rating_average': i.rating})
    return Response(list_movie_recommend_json, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def RatingMoive(request):
    user = request.user
    movieId = request.data.get('movieId')
    rating_score = request.data.get('rating')
    print(movieId, rating_score)
    try:
        rating = Rating.objects.get(Q(user=user) & Q(movie__movieId=movieId))
        rating.rating = rating_score
        rating.save()
        serializer = RatingSerializer(rating)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        rating = Rating(user=user, movie=Movie.objects.get(movieId=movieId), rating=rating_score)
        rating.save()
        serializer = RatingSerializer(rating)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def getRating(request):
    user = request.user
    movieId = request.data.get('movieId')
    try:
        rating = Rating.objects.get(Q(user=user) & Q(movie__movieId=movieId))
        serializer = RatingSerializer(rating)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response({}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def MovieDetail(request, id): 
    movie = Movie.objects.get(movieId=int(id))
    serializer = MovieSerializer(movie)
    return Response(serializer.data, status=status.HTTP_200_OK)