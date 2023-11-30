import React from "react";
import "./ListMovie.css";
import { Movie } from "../index";

const ListMovie = (props) => {
  const { listMovies } = props;
  
  return (
    <div className="container-fluid bg__custom mh100">
      <div className="mx-4 py-5">
        <div className="row">
          {listMovies.map((movie) => (
            <div className="col-12 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 d-flex justify-content-center mb-4" key={movie.movieId}>
              <Movie movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListMovie;
