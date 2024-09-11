import axios from "axios";
import { getCookie } from "cookies-next";

const api = axios.create({
  baseURL: String(process.env.API_URL),
  headers: {
    Authorization: `Bearer ${getCookie("accessToken")}`,
  },
});

export default api;
