// axiosInstance.js
import axios from "axios";
import { VITE_BASE_API } from "../config";
console.log(VITE_BASE_API);
const axiosInstance = axios.create({
  baseURL: VITE_BASE_API,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
