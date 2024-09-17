import axios from "axios";
import { getCookie } from "cookies-next";

const api = axios.create({
  baseURL: String(process.env.API_URL),
  headers: {
    Authorization: `Bearer ${getCookie("accessToken")}`,
  },
  withCredentials: true,
});

export default api;
