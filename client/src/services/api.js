import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { reduxstore } from "../redux/store";
import { reset, setAuthError } from "../redux/slices/userauthorslice";

const api = axios.create({
  baseURL: "http://localhost:2000",
});

// 🔥 Request Interceptor (Token + Expiry Check)
api.interceptors.request.use(
  (config) => {
    const token = reduxstore.getState()?.userauthorlogin?.token;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          reduxstore.dispatch(reset());
          localStorage.removeItem("authData");
          window.location.href = "/signup";
          return Promise.reject("Token expired");
        }

        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Invalid token:", error);
        reduxstore.dispatch(reset());
        localStorage.removeItem("authData");
        window.location.href = "/signup";
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Response Interceptor (401 Handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      reduxstore.dispatch(reset());
      localStorage.removeItem("authData");
      window.location.href = "/signup";
    }

    return Promise.reject(error);
  }
);

export default api;
