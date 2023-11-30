import React, { useState, useEffect } from "react";
import "./Home.css";
import { Navbar, ListMovie } from "../../components";
import BaseURLBackend from "../../utils/BackendURL";
import { RotatingLines } from "react-loader-spinner";
import useAxios from "../../utils/useAxios";

const Home = () => {
  const [listMovies, setListMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const api = useAxios();

  useEffect(() => {
    getListMovies();
  }, []);

  const getListMovies = async () => {
    setLoading(true);
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

  return (
    <div>
      <Navbar />
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
        <ListMovie listMovies={listMovies} />
      )}
    </div>
  );
};

export default Home;
