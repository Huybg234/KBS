import React, { useState, useEffect } from "react";
import "./MovieDetail.css";
import { useSearchParams } from "react-router-dom";
import { Navbar, RatingMovie, ListRecommend } from "../../components";
import BaseURLBackend from "../../utils/BackendURL";
import { RotatingLines } from "react-loader-spinner";
import useAxios from "../../utils/useAxios";

const MovieDetail = () => {
  const api = useAxios();

  const [params] = useSearchParams();
  const [listMovies, setListMovies] = useState([]);
  const [tab, setTab] = useState("relative");
  const movieId = params.get("id");
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    getMovie();
    getRating();
  }, [tab, movieId]);

  const getMovie = async () => {
    setLoading(true);
    api
      .get(`${BaseURLBackend}/data/movie/${movieId}/`)
      .then((response) => {
        setMovie(response.data);
        tab === "recommend"
          ? getListMovieRecommend()
          : getListMovieRelative(response.data.movieId);
      })
      .catch((err) => console.log(err));
  };

  const getListMovieRecommend = async () => {
    api
      .get(`${BaseURLBackend}/data/get-movies-collab/`)
      .then((respone) => {
        setLoading(false);
        setListMovies(respone.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getListMovieRelative = async (movieId) => {
    api
      .get(`${BaseURLBackend}/data/get-movies-content/${movieId}/`, {})
      .then((response) => {
        setLoading(false);
        setListMovies(response.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getRating = async () => {
    api
      .post(`${BaseURLBackend}/data/get-rating/`, {
        movieId,
      })
      .then((response) => setRating(response.data.rating))
      .catch((error) => setRating(0));
  };
  return (
    <div>
      <Navbar />
      <div className="container-fluid bg__custom">
        <div className="container py-5">
          <div className="row">
            <div className="col-12 col-lg-8 d-flex justify-content-center">
              <RatingMovie movie={movie} rating={rating} />
            </div>
            <div className="col-12 col-lg-4 d-flex flex-column justify-content-start mt-3 mt-lg-0">
              <div className="row mb-2 gap-2 px-2 px-lg-0">
                <button
                  className={`py-1 button__getRecommend text-white text_custom ${
                    tab === "relative" ? "bg_active" : ""
                  }`}
                  onClick={() => setTab("relative")}
                >
                  Relative Video
                </button>
                <button
                  className={`py-1 button__getRecommend text-white text_custom ${
                    tab === "recommend" ? "bg_active" : ""
                  }`}
                  onClick={() => setTab("recommend")}
                >
                  Get Recommend
                </button>
              </div>
              {loading ? (
                <RotatingLines
                  strokeColor="#f00"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="96"
                  visible={true}
                />
              ) : (
                <ListRecommend page={"movie_detail"} listMovies={listMovies} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
