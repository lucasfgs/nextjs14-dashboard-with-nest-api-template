import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

import AuthLayout from "@/components/pages/auth/_layout";
import api from "@/configs/api";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication page",
};

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function isValidToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

async function tryRefresh(): Promise<boolean> {
  try {
    await api.post("/auth/refresh");
    return true;
  } catch {
    return false;
  }
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // If the access token is present and valid, redirect immediately
  if (accessToken && (await isValidToken(accessToken))) {
    redirect("/dashboard");
  }

  // Otherwise, if a refresh token exists, attempt silent refresh
  if (refreshToken && (await tryRefresh())) {
    redirect("/dashboard");
  }

  // If neither check caused a redirect, render the login layout
  return <AuthLayout>{children}</AuthLayout>;
}
