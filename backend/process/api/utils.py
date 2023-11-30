import nltk
from nltk.stem.porter import PorterStemmer
import pandas as pd
import numpy as np
from numpy import load
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

# dict_data_for_content = load('dataset/matrix.npz')
# vectors = dict_data_for_content['arr_0']

dictionary = pd.read_csv('dataset/dictionary.csv')
# data = pd.read_csv('dataset/movies_data_final.csv')

# dict_data_for_colab = load('dataset/corrMatrix.npz')
# corrMatrix = dict_data_for_colab['arr_0']

# corrMatrix = pd.DataFrame(corrMatrix)

# dict_data_similarity = load('dataset/similarity.npz')
# similarity = dict_data_similarity['arr_0']
# columns_name = pd.read_csv('dataset/columns_name.csv')
# corrMatrix = pd.DataFrame(corrMatrix, columns=columns_name['movieId'].tolist(), index=columns_name['movieId'].tolist())

cv = CountVectorizer(max_features=5000, stop_words='english', vocabulary=dictionary['dictionary'].values, lowercase=False)

class Util:
    @staticmethod
    def recommend_content_base_name(movie, vectors, data):
        try:
            y = []
            ps = PorterStemmer()
            for i in movie.split():
                y.append(ps.stem(i))
            movie = " ".join(y)

            movie_feature = cv.fit_transform([movie]).toarray()
            new_vectors = np.append(vectors, movie_feature, axis=0)
            similarity = cosine_similarity(new_vectors)
            most_similars = sorted(list(enumerate(similarity[similarity.shape[0]-1])), reverse=True, key=lambda x:x[1])[1:21]
            result = []
            for similar in most_similars:
                result.append(data.loc[similar[0]])
            return result
        except:
            return []

    @staticmethod
    def recommend_collabrative_filtering(list_rating, corrMatrix, data, similarity):
        similar_movies = pd.DataFrame()
        for movieId, rating in list_rating:
            try:
                similar_movies = similar_movies.append(corrMatrix[movieId]*(rating-2.5), ignore_index=True)
            except:
                pass
        list_index_movies = similar_movies.sum().sort_values(ascending=False).head(20).index
        list_movie_recommend = []
        for id in list_index_movies:
            flag=False
            for movieId, rating in list_rating:
                if(id==movieId):
                    flag = True
                    break
            if(flag==False):
                list_movie_recommend.append(data.loc[data['movieId']==id].iloc[0])

        # Neu tat ca cac bo phim chua co danh gia nao, lay ra danh sach phim co do tuong dong ve noi dung voi phim da danh gia
        if(len(list_movie_recommend)==0):
            for movieId,  rating in list_rating:
                list_movie_recommend.append(Util().recommend_content_base_id(similarity, data, movieId))
        return list_movie_recommend

    @staticmethod
    def recommend_content_base_id(similarity, data, movie_id):
        most_similars = sorted(list(enumerate(similarity[data.loc[data['movieId']==movie_id].index[0]])), reverse=True, key=lambda x:x[1])[1:20]
        result = []
        for similar in most_similars:
            result.append(data.loc[similar[0]])
        return result


# print(Util().recommend_collabrative_filtering(([(1,4), (2, 4)]), corrMatrix, data))
