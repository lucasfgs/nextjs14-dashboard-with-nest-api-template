import axios from "axios";

let accessToken = null;

// Logic to handle if the cookie needs to be fetched from the server side or client side
if (typeof window === "undefined") {
  const { cookies } = require("next/headers");

  const cookieStore = cookies();
  accessToken = cookieStore.get("accessToken")?.value;
} else {
  const { getCookie } = require("cookies-next");

  accessToken = getCookie("accessToken");
}

const api = axios.create({
  baseURL: String(process.env.API_URL),
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  withCredentials: true,
});

export default api;
