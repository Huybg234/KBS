import React, { useState, useEffect } from "react";
import "./Search.css";
import { ListRecommend, Navbar } from "../../components";
import { useSearchParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import BaseURLBackend from "../../utils/BackendURL";
import useAxios from "../../utils/useAxios";

const Search = () => {

  const api = useAxios();

  const [params] = useSearchParams();
  const [listMovies, setListMovies] = useState([]);
  const query = params.get("query");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMovies();
  }, [query]);

  const getMovies = async () => {
    setLoading(true);
    api
      .post(`${BaseURLBackend}/data/search/`, {
        'search': query,
      })
      .then((response) => {
        setLoading(false);
        setListMovies(response.data);
      })
      .catch((err) => {
        setLoading(false)
        console.log(err);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid bg__custom mh100">
        <div className="container py-5">
          <div className="text-white pb-3 text_custom fs-2">
            Search for: {query}
          </div>
          {loading ? (
            <div className="text-center">
              <RotatingLines
                strokeColor="#f00"
                strokeWidth="5"
                animationDuration="0.75"
                width="96"
                visible={true}
              />
            </div>
          ) : (
            <ListRecommend page={"search"} listMovies={listMovies} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
