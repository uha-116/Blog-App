import axios from "axios";
import { reduxstore } from "../redux/store";
import { setAuthError } from "../redux/slices/userauthorslice";

const api = axios.create({
  baseURL: "http://localhost:2000",
});

api.interceptors.request.use(
  (config) => {
    const token = reduxstore.getState()?.userauthorlogin?.token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      reduxstore.dispatch(setAuthError("Please login to continue."));
      setTimeout(() => {
        window.location.href = "/signup";
      }, 3000);
    }

    return Promise.reject(error);
  }
);

export default api;
