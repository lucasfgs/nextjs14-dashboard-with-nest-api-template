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
  async (error) => {
    const origReq = error.config as any;
    const url = origReq.url as string;

    // If this is the refresh endpoint itself, handle failure immediately
    if (url.includes("/auth/refresh")) {
      // Only set refreshFailed if we get a specific error indicating the refresh token is invalid
      if (error.response?.status === 401) {
        refreshFailed = true;
      }
      return Promise.reject(error);
    }

    // For all other 401s, attempt queue + refresh logic
    if (error.response?.status === 401) {
      // Skip token refresh for 2FA endpoints
      if (url.includes("/auth/2fa/")) {
        return Promise.reject(error);
      }

      // Skip token refresh for login endpoint when 2FA is required
      if (
        error.response?.data?.message ===
        "Two-factor authentication token is required"
      ) {
        return Promise.reject(error);
      }

      // If already retried or refresh previously failed, reject
      if (origReq._retry || refreshFailed) {
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
            .then((response) => {
              // Reset refresh failed flag on successful refresh
              refreshFailed = false;
              processQueue(null);
            })
            .catch((err) => {
              // Only set refreshFailed if we get a 401 from the refresh endpoint
              if (err.response?.status === 401) {
                refreshFailed = true;
              }
              processQueue(err);
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
  responseType?: "json" | "blob" | "arraybuffer" | "text";
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  links?: {
    first: string;
    last: string;
    next: string | null;
    previous: string | null;
  };
}

export async function request<T = any>(
  path: string,
  {
    method = "GET",
    headers: extra = {},
    body,
    responseType = "json",
  }: RequestOptions = {}
): Promise<ApiResponse<T> | T> {
  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    const response = await axiosClient.request<T>({
      url: path,
      method,
      data: body,
      headers: extra,
      withCredentials: true,
      responseType: responseType as any,
    });

    // For blob/arraybuffer/text responses, return raw data
    if (responseType !== "json") {
      return response.data as T;
    }

    // Check if response.data is already wrapped in ApiResponse format
    const data = response.data;
    if (data && typeof data === "object" && "data" in data) {
      // Already wrapped in ApiResponse format
      return data as ApiResponse<T>;
    } else {
      // Raw data, wrap it in ApiResponse format
      return { data: data as T } as ApiResponse<T>;
    }
  }

  let cookieHeader = "";
  try {
    const { cookies } = require("next/headers");
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    cookieHeader = allCookies
      .map((c: any) => `${c.name}=${c.value}`)
      .join("; ");
  } catch (error) {
    console.log(`[API] Failed to read cookies on server:`, error);
    // pages/ router fallback
  }

  // Ensure proper URL construction without double slashes
  const baseUrl = (process.env.API_URL || "").replace(/\/$/, ""); // Remove trailing slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`; // Ensure path starts with slash
  const fullUrl = `${baseUrl}${cleanPath}`;

  const res = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...extra,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
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
    throw new Error(`${method} ${cleanPath} failed: ${res.status} ${errText}`);
  }

  if (res.status === 204 || method === "HEAD") {
    return { data: null as unknown as T };
  }

  const data = await res.json();

  // Check if response data is already wrapped in ApiResponse format
  if (data && typeof data === "object" && "data" in data) {
    // Already wrapped in ApiResponse format
    return data as ApiResponse<T>;
  } else {
    // Raw data, wrap it in ApiResponse format
    return { data: data as T } as ApiResponse<T>;
  }
}

// ————————————————
// Convenience Methods
// ————————————————
const api = {
  request,
  get: <T = any>(
    p: string,
    options?: {
      headers?: Record<string, string>;
      responseType?: "json" | "blob" | "arraybuffer" | "text";
    }
  ): Promise<ApiResponse<T>> =>
    request<T>(p, {
      method: "GET",
      headers: options?.headers,
      responseType: options?.responseType,
    }) as Promise<ApiResponse<T>>,
  post: <T = any>(
    p: string,
    b?: any,
    h?: Record<string, string>
  ): Promise<ApiResponse<T>> =>
    request<T>(p, { method: "POST", body: b, headers: h }) as Promise<
      ApiResponse<T>
    >,
  put: <T = any>(
    p: string,
    b?: any,
    h?: Record<string, string>
  ): Promise<ApiResponse<T>> =>
    request<T>(p, { method: "PUT", body: b, headers: h }) as Promise<
      ApiResponse<T>
    >,
  patch: <T = any>(
    p: string,
    b?: any,
    h?: Record<string, string>
  ): Promise<ApiResponse<T>> =>
    request<T>(p, { method: "PATCH", body: b, headers: h }) as Promise<
      ApiResponse<T>
    >,
  delete: <T = any>(
    p: string,
    b?: any,
    h?: Record<string, string>
  ): Promise<ApiResponse<T>> =>
    request<T>(p, { method: "DELETE", body: b, headers: h }) as Promise<
      ApiResponse<T>
    >,
  options: <T = any>(
    p: string,
    h?: Record<string, string>
  ): Promise<ApiResponse<T>> =>
    request<T>(p, { method: "OPTIONS", headers: h }) as Promise<ApiResponse<T>>,
  head: <T = any>(
    p: string,
    h?: Record<string, string>
  ): Promise<ApiResponse<T>> =>
    request<T>(p, { method: "HEAD", headers: h }) as Promise<ApiResponse<T>>,
};

export default api;
