import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home, Authentication, MovieDetail, Search} from "../../pages";

import AuthContext from "../../contexts/AuthContext/AuthContext";

const Routers = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Routes>
        <Route
          path="/overview"
          element={
            user ? <Navigate to={"/"} /> : <Authentication page="overview" />
          }
        />
        <Route
          path="/login"
          element={
            user ? <Navigate to={"/"} /> : <Authentication page="login" />
          }
        />
        <Route path="/register" element={<Authentication page="register" />} />
        <Route
          path="/reset-password"
          element={<Authentication page="reset-password" />}
        />
        <Route
          path="/request-reset-password"
          element={<Authentication page="request-reset-password" />}
        />
        <Route path="/movie-detail" element={<MovieDetail />} exact/>
        <Route
          path="/"
          // element={user ? <Home /> : <Navigate to={"/overview"} />}
          element={<Home />}
        />
        <Route
          path="/search" element={<Search/>}
        />
      </Routes>
    </>
  );
};

export default Routers;
