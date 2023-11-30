import React, { useState, useContext } from "react";
import { MDBContainer, MDBInput, MDBCheckbox, MDBBtn } from "mdb-react-ui-kit";

import { Link, useSearchParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

import AuthContext from "../../contexts/AuthContext/AuthContext";
import "./AuthenticationForm.css";
import backgroundVideo from "../../assets/video.mp4";

const AuthenticationForm = (props) => {
  const [params] = useSearchParams();
  const { page } = props;

  const [notify, setNotify] = useState(() => {
    if (page === "login") {
      if (params.get("verified") === "True")
        return "Your email has been verified. You can login to website.";
      if (params.get("verified") === "False")
        return "Time to verify your email has expired. You can check lastest email to reverify your email.";
      if (params.get("verified") === "Error")
        return "Your link to activate your account have not correct. Recheck your email.";
    }
    if (page === "reset-password") {
      if (params.get("token-verified") === "INVALID" || params.get("token-verified") === null)
        return "Token to verify your email not true or expired. Please try a new one forgot password in login page.";
    }
    return "";
  });

  const {
    handleLogin,
    handleRegister,
    handleResetPassword,
    handleRequestResetPassword,
    message,
    setMessage,
    loading,
  } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });

  const [hidePassword1, setHidePassword1] = useState(true);
  const [hidePassword2, setHidePassword2] = useState(true);

  const handleLoginForm = async () => {
    if (
      userData.email &&
      userData.email.includes("@") &&
      userData.email.includes(".com")
    ) {
      handleLogin(userData.email, userData.password);
    } else {
      setMessage({
        error: "Entered invalid email. (Email must contain @ and .com)",
        success: "",
      });
    }
  };

  const handleResetForm = () => {
    setUserData({
      email: "",
      username: "",
      password: "",
      passwordConfirm: "",
    });
  };

  const checkPasswordInput = (password, passwordConfirm) => {
    if (password !== passwordConfirm) {
      setMessage({
        error: "Password and password confirm does't match.",
        success: "",
      });
      return 0;
    }
    if (password.length < 8) {
      setMessage({
        error: "Password so short. (Password should be >=8 character.)",
        success: "",
      });
      return 0;
    }
    return 1;
  };

  const handleRigisterForm = async () => {
    if (checkPasswordInput(userData.password, userData.passwordConfirm) === 1) {
      handleRegister(userData.email, userData.username, userData.password);
    }
  };

  const handleResetPasswordForm = async () => {
    if (checkPasswordInput(userData.password, userData.passwordConfirm) === 1) {
      handleResetPassword(
        userData.password,
        params.get("uidb64"),
        params.get("token")
      );
      handleResetForm();
    }
  };

  const handleRequestResetPasswordForm = async () => {
    if (
      userData.email &&
      userData.email.includes("@") &&
      userData.email.includes(".com")
    ) {
      handleRequestResetPassword(userData.email);
    } else {
      setMessage({
        error: "Entered invalid email. (Email must contain @ and .com)",
        success: "",
      });
    }
  };

  const handleKeydownPasswordInput = async (e) => {
    if (e.which === 13 && page === "login") {
      handleLoginForm();
    }
  };

  return (
    <div className="h-100 w-100 d-flex flex-column justify-content-center align-items-center">
      <div className="h-100 w-100 position-relative">
        <video
          src={backgroundVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="h-100 w-100 video"
        />
        <div className="position-absolute top-50 start-50 translate-middle mask h-100 w-100">
          <div className="d-flex flex-column justify-content-center align-items-center h-100">
            <div className="position-absolute top-0 start-0">
              <Link to={"/"}>
                <span className="text-logo">GROUP 11</span>
              </Link>
            </div>
            {page === "overview" && (
              <>
                <div className="position-absolute top-0 end-0">
                  <Link to={"/login"}>
                    <span className="button btn text-white btn-sm">
                      Sign In
                    </span>
                  </Link>
                </div>
                <div>
                  <h1 className="text-white text-title text_custom">
                    Movies Recommendation System
                  </h1>
                  <p className="text-center text-white text_custom fs-2">
                    Enjoy your life with simple things and be happy
                  </p>
                  <p className="text-center text-white fs-3">Are you ready?</p>
                </div>
              </>
            )}
          </div>
        </div>

        {page !== "overview" && (
          <div className="position-absolute top-50 start-50 translate-middle auth-form rounded">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <MDBContainer className="py-2 my-2 d-flex flex-column w-75">
                <div>
                  <h1 className="text_custom text-white mb-4">
                    {page === "login"
                      ? "Sign In"
                      : page === "register"
                      ? "Sign Up"
                      : page === "reset-password"
                      ? "Reset password"
                      : "Request reset password"}
                  </h1>
                </div>

                {message.success && (
                  <div className="text-center text-small text-success mb-3 text_custom">
                    {message.success}
                  </div>
                )}

                {notify && (
                  <div className="text-center text-small text-success mb-3 text_custom">
                    {notify}
                  </div>
                )}

                {page !== "reset-password" && (
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Email address"
                    id="form1"
                    type="email"
                    size="lg"
                    contrast
                    autoFocus
                    value={userData.email}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                )}

                {page === "register" && (
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Username"
                    id="form2"
                    type="text"
                    size="lg"
                    contrast
                    autoFocus
                    value={userData.username}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                )}

                {page !== "request-reset-password" && (
                  <div className="position-relative">
                    <div>
                      <MDBInput
                        wrapperClass="mb-4"
                        label="Password"
                        id="form3"
                        type={hidePassword1 ? "password" : "text"}
                        size="lg"
                        contrast
                        value={userData.password}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => handleKeydownPasswordInput(e)}
                      />
                    </div>
                    <div
                      className="position-absolute top-0 end-0 translate-middle-x mt-2 text-white"
                      onClick={() => setHidePassword1((prev) => !prev)}
                    >
                      {hidePassword1 ? (
                        <BsEyeFill size={20} />
                      ) : (
                        <BsEyeSlashFill size={20} />
                      )}
                    </div>
                  </div>
                )}

                {(page === "register" || page === "reset-password") && (
                  <div className="position-relative">
                    <div>
                      <MDBInput
                        wrapperClass="mb-3"
                        label="Password confirm"
                        id="form4"
                        type={hidePassword2 ? "password" : "text"}
                        size="lg"
                        contrast
                        value={userData.passwordConfirm}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            passwordConfirm: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div
                      className="position-absolute top-0 end-0 translate-middle-x mt-2 text-white"
                      onClick={() => setHidePassword2((prev) => !prev)}
                    >
                      {hidePassword2 ? (
                        <BsEyeFill size={20} />
                      ) : (
                        <BsEyeSlashFill size={20} />
                      )}
                    </div>
                  </div>
                )}

                {message.error && (
                  <div className="text-center text-small text-md-start mb-3 text-warning text_custom">
                    {message.error}
                  </div>
                )}

                {(page === "login" || page === "register") && (
                  <div className="d-flex justify-content-between mx-3 mb-4">
                    <MDBCheckbox
                      name="flexCheck"
                      value=""
                      id="flexCheckDefault"
                      label="Remember me"
                    />
                    <Link
                      to={"/request-reset-password"}
                      onClick={() => {
                        handleResetForm();
                        setMessage({ success: "", error: "" });
                        setNotify("");
                      }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {loading && (
                  <>
                    <div className="text-small text-danger d-flex justify-content-center">
                      <RotatingLines strokeColor="#e50914" width="42" />
                    </div>
                    <div className="text-center text-small fs-6 text-white text_custom mb-4">
                      please wait a minute
                    </div>
                  </>
                )}

                <MDBBtn
                  className="mb-4 button-main btn btn-danger"
                  size="lg"
                  onClick={
                    page === "login"
                      ? handleLoginForm
                      : page === "register"
                      ? handleRigisterForm
                      : page === "reset-password"
                      ? handleResetPasswordForm
                      : handleRequestResetPasswordForm
                  }
                >
                  {page === "login"
                    ? "Sign In"
                    : page === "register"
                    ? "Sign Up"
                    : page === "reset-password"
                    ? "Reset password"
                    : "Request reset password"}
                </MDBBtn>

                <div className="text-center">
                  {page === "login" ? (
                    <p className="m-0">
                      Not a member?{" "}
                      <Link
                        to={"/register"}
                        onClick={() => {
                          setMessage({ success: "", error: "" });
                          setNotify("");
                          setHidePassword1(true);
                          setHidePassword2(true);
                          handleResetForm();
                        }}
                      >
                        Sign Up
                      </Link>
                    </p>
                  ) : (
                    <p className="m-0">
                      You are member?{" "}
                      <Link
                        to={"/login"}
                        onClick={() => {
                          setMessage({ success: "", error: "" });
                          setNotify("");
                          setHidePassword1(true);
                          setHidePassword2(true);
                          handleResetForm();
                        }}
                      >
                        Sign In
                      </Link>
                    </p>
                  )}
                </div>
              </MDBContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthenticationForm;
