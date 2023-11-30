import React from "react";
import { Link } from "react-router-dom";
import "./Movie.css";

import ReactStars from "react-rating-stars-component";

const Movie = (props) => {
  const { movie } = props;

  return (
    <div className="movie__container d-flex flex-column gap-3 cursor-pointer">
      <Link to={`/movie-detail/?id=${movie.movieId}`}>
        <img
          src={movie ? movie.poster_url : ""}
          alt="movie"
          className="poster__video rounded_custom"
        />
        <div className="d-flex flex-column px-2 pb-2">
          <span className="text-white fs-5">{movie ? movie.title : ""}</span>
          <span className="text-secondary text_custom fs-6">
            {movie ? movie.genres.split(" ").join(" | ") : ""}
          </span>
          <div className="text-secondary text_custom d-flex gap-1">
            <span className="rating__text">Rating: </span>{" "}
            <span className="text-warning m-1 text">
              <u>{(movie ? movie.rating_average : 0).toFixed(1)}</u>
            </span>
            <div className="align-self-center">
              <ReactStars
                count={5}
                value={movie ? movie.rating_average : 0}
                isHalf={true}
                size={20}
                activeColor="#ffd700"
                edit={false}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Movie;
