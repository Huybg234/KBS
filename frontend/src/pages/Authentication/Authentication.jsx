import React from "react";
import { AuthenticationForm } from "../../components";

const Authentication = (props) => {
  const {page} = props

  return (
    <>
      <AuthenticationForm page={page}/>
    </>
  );
};

export default Authentication;
