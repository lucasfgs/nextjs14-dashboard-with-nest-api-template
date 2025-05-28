import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import cookie from "cookie";

// Browser‐side axios instance
const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach accessToken to every browser request
axiosClient.interceptors.request.use((cfg) => {
  if (typeof document !== "undefined") {
    const cookies = cookie.parse(document.cookie);
    if (cookies.accessToken) {
      cfg.headers = cfg.headers ?? {};
      cfg.headers.Authorization = `Bearer ${cookies.accessToken}`;
    }
  }
  return cfg;
});

// Auto‐refresh on 401 + retry in the browser
axiosClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const orig = err.config!;
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      try {
        await axiosClient.post("/auth/refresh");
        // After refresh, the backend will set a new accessToken cookie
        // The next request will automatically pick it up from cookies
        return axiosClient(orig);
      } catch {
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Universal request helper.
 * - In the browser: delegates to axiosClient.
 * - In SSR: first tries an accessToken cookie, then falls back to refresh.
 */
export async function request<T = any>(
  path: string,
  { method = "GET", headers: extra = {}, body }: RequestOptions = {}
): Promise<{ data: T }> {
  const isBrowser = typeof window !== "undefined";
  if (!isBrowser) {
    // ── SERVER SIDE ──

    let cookieHeader = "";
    try {
      // Works only in App Router server components
      // Fails silently under pages/ so cookieHeader remains empty
      const { cookies } = require("next/headers");
      cookieHeader = cookies()
        .getAll()
        .map((c: any) => `${c.name}=${c.value}`)
        .join("; ");
    } catch {
      /* no-op */
    }

    const parsed = cookie.parse(cookieHeader || "");
    const accessToken = parsed.accessToken;

    // 3) Call the actual backend via Next.js proxy
    const res = await fetch(`${process.env.API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...extra,
      },
      credentials: "include",
      cache: "no-store",
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`${method} ${path} failed: ${res.status} ${err}`);
    }
    if (res.status === 204 || method === "HEAD") {
      return { data: null as unknown as T };
    }
    return { data: (await res.json()) as T };
  }

  // ── BROWSER SIDE ──
  const cfg: AxiosRequestConfig = {
    url: path,
    method,
    data: body,
    headers: {
      ...extra,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true,
  };
  const response = await axiosClient.request(cfg);
  return { data: response.data as T };
}

// Mirror common axios methods
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
