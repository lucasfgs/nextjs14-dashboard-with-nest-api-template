import api from "@/configs/api";

export interface IAuthenticatedUser {
  sub: string;
  role: string;
  permissions: string[];
}

export async function validateAuthenticatedUser(): Promise<IAuthenticatedUser | null> {
  try {
    const user = await api.get("/auth/me");

    console.log("user", user);

    return user.data;
  } catch (e) {
    return null;
  }
}
