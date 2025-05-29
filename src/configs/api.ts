import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";

// ————————————————
// Shared Axios instance (browser only)
// ————————————————
const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ————————————————
// Refresh Queue Logic
// ————————————————
let isRefreshing = false;
let refreshFailed = false;
const requestQueue: Array<{
  config: AxiosRequestConfig;
  resolve: (value: AxiosResponse) => void;
  reject: (error: any) => void;
}> = [];

async function processQueue(error: any) {
  for (const { config, resolve, reject } of requestQueue) {
    if (error) {
      reject(error);
    } else {
      resolve(await axiosClient(config));
    }
  }
  requestQueue.length = 0;
}

// ————————————————
// Client-side interceptor: on 401 → silent refresh → retry queued
// ————————————————
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const origReq = error.config as any;
    const url = origReq.url as string;

    // If this is the refresh endpoint itself, handle failure immediately
    if (url.includes("/auth/refresh")) {
      refreshFailed = true;
      // redirect to login on first refresh failure
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // For all other 401s, attempt queue + refresh logic
    if (error.response?.status === 401) {
      // If already retried or refresh previously failed, redirect
      if (origReq._retry || refreshFailed) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      // Mark original request for retry and queue it
      origReq._retry = true;
      return new Promise<AxiosResponse>((resolve, reject) => {
        requestQueue.push({ config: origReq, resolve, reject });

        if (!isRefreshing) {
          isRefreshing = true;
          axiosClient
            .post("/auth/refresh")
            .then(() => {
              processQueue(null);
            })
            .catch((err) => {
              refreshFailed = true;
              processQueue(err);
              if (typeof window !== "undefined") {
                window.location.href = "/login";
              }
            })
            .finally(() => {
              isRefreshing = false;
            });
        }
      });
    }

    return Promise.reject(error);
  }
);

// ————————————————
// Universal Request Helper
// ————————————————
export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";
  headers?: Record<string, string>;
  body?: any;
}

export async function request<T = any>(
  path: string,
  { method = "GET", headers: extra = {}, body }: RequestOptions = {}
): Promise<{ data: T }> {
  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    const response = await axiosClient.request<T>({
      url: path,
      method,
      data: body,
      headers: extra,
      withCredentials: true,
    });
    return { data: response.data };
  }

  let cookieHeader = "";
  try {
    const { cookies } = require("next/headers");
    cookieHeader = cookies()
      .getAll()
      .map((c: any) => `${c.name}=${c.value}`)
      .join("; ");
  } catch {
    // pages/ router fallback
  }

  const res = await fetch(`${process.env.API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...extra,
      Cookie: cookieHeader,
    },
    credentials: "include",
    cache: "no-store",
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    const errText = await res.text().catch(() => "");
    throw new Error(`${method} ${path} failed: ${res.status} ${errText}`);
  }

  if (res.status === 204 || method === "HEAD") {
    return { data: null as unknown as T };
  }

  const data = (await res.json()) as T;
  return { data };
}

// ————————————————
// Convenience Methods
// ————————————————
const api = {
  request,
  get: <T = any>(p: string, h?: Record<string, string>) =>
    request<T>(p, { method: "GET", headers: h }),
  post: <T = any>(p: string, b?: any, h?: Record<string, string>) =>
    request<T>(p, { method: "POST", body: b, headers: h }),
  put: <T = any>(p: string, b?: any, h?: Record<string, string>) =>
    request<T>(p, { method: "PUT", body: b, headers: h }),
  patch: <T = any>(p: string, b?: any, h?: Record<string, string>) =>
    request<T>(p, { method: "PATCH", body: b, headers: h }),
  delete: <T = any>(p: string, h?: Record<string, string>) =>
    request<T>(p, { method: "DELETE", headers: h }),
  options: <T = any>(p: string, h?: Record<string, string>) =>
    request<T>(p, { method: "OPTIONS", headers: h }),
  head: <T = any>(p: string, h?: Record<string, string>) =>
    request<T>(p, { method: "HEAD", headers: h }),
};

export default api;
