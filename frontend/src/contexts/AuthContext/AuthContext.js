import { createContext, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import BaseURLBackend from "../../utils/BackendURL";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(JSON.parse(localStorage.getItem("authTokens")).access)
      : null
  );

  const [message, setMessage] = useState({
    error: "",
    success: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setLoading(true);
    axios
      .post(`${BaseURLBackend}/auth/token/`, {
        email,
        password,
      })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          if (jwt_decode(response.data.access).is_verified === false) {
            setMessage({
              error:
                "Your email unverified. Please check email to verify your email. (maybe check spam box).",
              success: "",
            });
          } else {
            setAuthTokens(response.data);
            setUser(jwt_decode(response.data.access));
            localStorage.setItem("authTokens", JSON.stringify(response.data));
            setMessage({ success: "", error: "" });
            navigate("/");
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 401) {
          setMessage({
            error: "Email and password doesn't match.",
            success: "",
          });
        } else {
          setMessage({
            error:
              "Sorry network or server have error. Please try again later.",
            success: "",
          });
        }
      });
  };

  const handleRegister = async (email, username, password) => {
    setLoading(true);
    axios
      .post(`${BaseURLBackend}/auth/register/`, {
        email,
        username,
        password,
      })
      .then((response) => {
        setLoading(false);
        if (response.status === 201) {
          setMessage({
            success:
              "We have sent an email to verify your email. please check your email. you can check spam box.",
            error: "",
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400) {
          let errorMessage = "";
          for (const key in error.response.data) {
            if (error.response.data.hasOwnProperty(key)) {
              errorMessage += `${key.toUpperCase()}: ${
                error.response.data[key]
              }  `;
            }
          }
          setMessage({
            error: errorMessage,
            success: "",
          });
        } else {
          setMessage({
            error: "Server or network have an error. Try again later.",
            success: "",
          });
        }
      });
  };

  const handleResetPassword = (password, uidb64, token) => {
    setLoading(true);
    axios
      .patch(`${BaseURLBackend}/auth/reset-password-complete/`, {
        password,
        uidb64,
        token,
      })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setMessage({
            success: "Reset password successfully.",
            error: "",
          });
          navigate("/login");
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400) {
          setMessage({
            success: "",
            error:
              "Link to reset password not correct. Please try a new one forgot password in login page",
          });
        } else {
          setMessage({
            success: "",
            error:
              "Server or network have a some error. Please try again later",
          });
        }
      });
  };

  const handleRequestResetPassword = (email) => {
    setLoading(true);
    axios
      .post(`${BaseURLBackend}/auth/request-reset-password/`, { email })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setMessage({
            success:
              "We have sent an email to reset your password. Please check your email. (you can check spam box)",
            error: "",
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 401) {
          setMessage({
            error: "Email has not been registered for any accounts!",
            success: "",
          });
        } else {
          setMessage({
            error: "Server or network have an error. Try again later.",
            success: "",
          });
        }
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("authTokens");
    setUser(null);
    setAuthTokens(null);
    navigate("/overview");
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    handleLogin,
    message,
    setMessage,
    handleLogout,
    handleRegister,
    handleResetPassword,
    handleRequestResetPassword,
    loading,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
