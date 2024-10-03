"use client";
import { useState } from "react";
import {
  getCookie,
  setCookie,
  deleteCookie,
  CookieValueTypes,
} from "cookies-next";

export default function useTokens() {
  // Try to get the access token from the cookeis and store it in the state
  const [accessToken, storeAccessToken] = useState<CookieValueTypes | null>(
    () => {
      return getCookie("accessToken");
    }
  );
  const [refreshToken, storeRefreshToken] = useState<CookieValueTypes | null>(
    () => {
      return getCookie("refreshToken");
    }
  );

  const setAccessToken = (accessToken: string) => {
    setCookie("accessToken", accessToken);
    storeAccessToken(accessToken);
  };

  const setRefreshToken = (refreshToken: string) => {
    setCookie("refreshToken", refreshToken);
    storeRefreshToken(refreshToken);
  };

  const removeAccessToken = () => {
    deleteCookie("accessToken");
    storeAccessToken(null);
  };

  const removeRefreshToken = () => {
    deleteCookie("refreshToken");
    storeRefreshToken(null);
  };

  return {
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
    removeAccessToken,
    removeRefreshToken,
  };
}
