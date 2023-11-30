import React from "react";
import "./Recommend.css";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
const Recommend = (props) => {
  const { page, movie } = props;

  return (
    <Link to={`/movie-detail/?id=${movie.movieId}`}>
      <div className="row mb-2">
        <div
          className={`${
            page === "search" ? "col-6" : "col-5"
          } col-lg-6 px-lg-0 text-end px-2 mb-2`}
        >
          <img
            src={movie ? movie.poster_url : ""}
            alt="movie"
            className={`rounded_custom ${
              page === "search" ? "heigh__search" : "heigh__movie-detail"
            }`}
          />
        </div>
        <div
          className={`${
            page === "search" ? "col-6" : "col-7"
          } col-5 col-lg-6 text-white`}
        >
          <div>{movie ? movie.title : ""}</div>
          <div className="text_custom text-secondary">
            {movie ? movie.genres.split(" ").join(" | ") : ""}
          </div>

          {page === 'search' ? (
            <div className="text_custom text-secondary">
              {movie
                ? movie.description.length > 105
                  ? `${movie.description.slice(0, 105)} ...`
                  : movie.description
                : ""}
            </div>
          ) : (
            ""
          )}

          <div className="text_custom text-secondary d-flex gap-2">
            <span>Rating</span>
            <div>
              <ReactStars
                count={5}
                value={movie ? movie.rating_average : 0}
                isHalf={true}
                edit={false}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Recommend;
