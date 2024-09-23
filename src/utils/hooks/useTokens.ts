"use client";
import { useEffect, useState } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

export default function useTokens() {
  const [accessToken, storeAccessToken] = useState<string | null>(null);
  const [refreshToken, storeRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessToken = getCookie("accessToken");
    const storedRefreshToken = getCookie("refreshToken");

    if (storedAccessToken) {
      storeAccessToken(storedAccessToken);
    }

    if (storedRefreshToken) {
      storeRefreshToken(storedRefreshToken);
    }
  }, []);

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
