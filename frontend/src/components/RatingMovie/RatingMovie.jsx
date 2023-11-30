import React, { useState, useEffect } from "react";
import "./RatingMovie.css";
import Rating from "@mui/material/Rating";
import { useSearchParams } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import BaseURLBackend from "../../utils/BackendURL";

const RatingMovie = (props) => {
  const api = useAxios();

  const [params] = useSearchParams();
  const movieId = params.get("id");

  const { movie, rating } = props;
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(rating);
  }, [rating, movieId]);

  const handleRating = async (rating) => {
    api
      .post(`${BaseURLBackend}/data/rating/`, {
        movieId,
        rating,
      })
      .then((response) => {
        setValue(response.data.rating);
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="d-flex flex-column gap-3 cursor-pointer movie__rating__container">
      <img
        src={movie ? movie.poster_url : ""}
        alt="movie"
        className="poster__rating"
      />
      <div className="d-flex flex-column pb-2">
        <span className="text-white fs-4 text_custom">
          {movie ? movie.title : ""}
        </span>
        <span className="text-secondary text_custom fs-6">
          {movie ? movie.genres.split(" ").join(" | ") : ""}
        </span>
        <div className="text_custom py-2 mt-2 px-3 rating__aria__container">
          <div className="">
            <Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                handleRating(newValue);
              }}
              size="large"
              precision={0.5}
            />
          </div>
        </div>
        <div className="text_custom py-2 mt-2 px-3 rating__aria__container text-white">
          <span>{movie ? movie.description : ""}</span>
        </div>
      </div>
    </div>
  );
};

export default RatingMovie;
