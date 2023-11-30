import React from "react";
import "./ListRecommend.css";
import { Recommend } from "../../components";

const ListRecommend = (props) => {
  const { page, listMovies } = props;
  
  return (
    <div className="w-100">
      {listMovies ? (
        listMovies.map((movie) => (
          <Recommend page={page} key={movie.movieId} movie={movie} />
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default ListRecommend;
