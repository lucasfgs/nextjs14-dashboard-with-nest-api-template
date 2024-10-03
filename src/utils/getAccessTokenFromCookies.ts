import { getCookie } from "cookies-next";

// Function to get cookies depending on the environment (client or server)
export const getAccessTokenFromCookies = async () => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    // Server-side: Use next/headers to access cookies
    const { cookies } = await import("next/headers");
    const cookieStore = cookies();
    return cookieStore.get("accessToken")?.value || undefined;
  } else {
    // Client-side: Use cookies-next to access cookies
    return getCookie("accessToken") as string | undefined;
  }
};
