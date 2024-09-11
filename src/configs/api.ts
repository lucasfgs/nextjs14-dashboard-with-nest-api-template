import axios from "axios";

const api = axios.create({
  baseURL: String(process.env.API_URL),
});

export default api;
