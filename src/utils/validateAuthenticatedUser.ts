import { cookies } from "next/headers";

import api from "@/configs/api";

function getTokenFromCookies(): string | null {
  const cookieStore = cookies();

  const token = cookieStore.get("accessToken");

  if (!token) {
    return null;
  }

  return token.value;
}

export async function validateAuthenticatedUser() {
  const token = await getTokenFromCookies();

  api.defaults.headers.Authorization = `Bearer ${token}`;
  if (!token) {
    return null;
  }

  try {
    const { data: authenticatedUser } = await api.get("/me");

    return authenticatedUser;
  } catch (error) {
    return null;
  }
}
