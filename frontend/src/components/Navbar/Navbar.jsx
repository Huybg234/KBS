import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { IoLogoElectron } from "react-icons/io5";
import {  CiLogin } from "react-icons/ci";
import { RiAccountPinCircleLine } from "react-icons/ri";

import AuthContext from "../../contexts/AuthContext/AuthContext";
import { SearchComponent } from '../../components'

const Navbar = () => {
  const { user, handleLogout } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  return (
    <div className="row flex-wrap nav__container flex-wrap position-relative pb-sm-2 pd-xs-2 w-100 m-0">
      <Link to={"/"} className="col-12 col-lg-3 col-md-3">
        <div className="d-flex p-3 mx-1 gap-1">
          <div className="mt-1">
            <IoLogoElectron color="#e50914" fontSize={40} />
          </div>
          <span className="fw-bold fs-3 text_custom text-white">Group 11</span>
        </div>
      </Link>
      <SearchComponent/>
      <div className="col-12 col-lg-2 col-md-2 col-sm-2 align-self-center position-relative">
        <div className="cursor-pointer text-center">
          <RiAccountPinCircleLine
            color="white"
            fontSize={36}
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        {open && (
          <div className="position-absolute account__info__container d-flex flex-column align-items-center text-white">
            <div className="account__info d-flex justify-content-start w-100 mb-3">
              <div>
                <RiAccountPinCircleLine color="white" size={40} />
              </div>
              <div className="align-self-center fs-4">
                {user ? user.username : "null"}
              </div>
            </div>
            <div
              className="logout d-flex justify-content-start w-100 cursor-pointer"
              onClick={handleLogout}
            >
              <div>
                <CiLogin color="white" size={24} />
              </div>
              <div className="align-self-center">Logout</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
