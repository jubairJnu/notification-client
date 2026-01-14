import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.api_url,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;
