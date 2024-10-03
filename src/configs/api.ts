import axios from "axios";

import { getAccessTokenFromCookies } from "@/utils/getAccessTokenFromCookies";

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const api = axios.create({
  baseURL: String(process.env.API_URL),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessTokenFromCookies();

    // If accessToken is available, set it in the Authorization header
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

// Function to add subscribers to the queue
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Function to notify all subscribers with the new token
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Add response interceptors to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already happening, queue the request
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post("/api/auth/refresh");

        const accessToken = getAccessTokenFromCookies();
        isRefreshing = false;

        onRefreshed(String(accessToken));

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
