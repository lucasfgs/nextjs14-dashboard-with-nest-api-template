import { cookies } from "next/headers";

export interface IAuthenticatedUser {
  sub: string;
  role: string;
  permissions: string[];
}

export async function validateAuthenticatedUser(): Promise<IAuthenticatedUser | null> {
  const accessToken = cookies().get("accessToken")?.value;

  try {
    const response = await fetch(`${process.env.API_URL}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    const user = await response.json();
    return user;
  } catch (e) {
    return null;
  }
}
