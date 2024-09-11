import { useEffect, useState } from "react";

export default function useTokens() {
  const [accessToken, storeAccessToken] = useState<string | null>(null);
  const [refreshToken, storeRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const storedAccessToken = window.localStorage.getItem("accessToken");
    const storedRefreshToken = window.localStorage.getItem("refreshToken");

    if (storedAccessToken) {
      storeAccessToken(JSON.parse(storedAccessToken));
    }

    if (storedRefreshToken) {
      storeRefreshToken(JSON.parse(storedRefreshToken));
    }
  }, []);

  const setAccessToken = () => {
    window.localStorage.setItem("accessToken", JSON.stringify(accessToken));
    storeAccessToken(accessToken);
  };

  const setRefreshToken = () => {
    window.localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
    storeRefreshToken(refreshToken);
  };

  const removeAccessToken = () => {
    window.localStorage.removeItem("accessToken");
    storeAccessToken(null);
  };

  const removeRefreshToken = () => {
    window.localStorage.removeItem("refreshToken");
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
