import axios, { InternalAxiosRequestConfig } from "axios";
import { getCookie } from "cookies-next";

const api = axios.create({
  baseURL: String(process.env.API_URL),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.headers?.Authorization) {
    config.headers.Authorization = `Bearer ${getCookie("accessToken")}`;
  }
  return config;
});

export default api;
