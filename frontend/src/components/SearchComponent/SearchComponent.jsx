import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SearchComponent.css";
import { CiSearch } from "react-icons/ci";

const SearchComponent = () => {
  const Navigate = useNavigate();

  const [search, setSearch] = useState("");

  const handleButtonSearch = (e) => {
    if (!search) {
      e.preventDefault();
    }
  };

  const handleKeydownInput = (e) => {
    if (e.keyCode === 13 && search) {
      Navigate(`/search/?query=${search}`);
    }
  };

  return (
    <div className="col-12 col-lg-7 col-md-7 col-sm-7 d-flex justify-content-center align-self-center search__container">
      <div className="input__search_container position-relative w-75">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => handleKeydownInput(e)}
        />
        <div className="button__search_container position-absolute">
          <Link
            to={`/search/?query=${search}`}
            onClick={(e) => handleButtonSearch(e)}
          >
            <div className="position-absolute search__icon__container">
              <CiSearch color="white" fontSize={24} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
