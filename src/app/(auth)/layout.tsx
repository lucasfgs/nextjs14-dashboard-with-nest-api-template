import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
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
    const response = await api.post("/auth/refresh");
    return true;
  } catch (error) {
    return false;
  }
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headersList = await headers();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Get the redirect URL from the URL
  const url = new URL(headersList.get("x-url") || "");
  const redirectTo = url.searchParams.get("redirect") || "/dashboard";

  // If the access token is present and valid, redirect to the original destination
  if (accessToken && (await isValidToken(accessToken))) {
    redirect(redirectTo);
  }

  // Otherwise, if a refresh token exists, attempt silent refresh
  if (refreshToken && (await tryRefresh())) {
    redirect(redirectTo);
  }

  // If neither check caused a redirect, render the login layout
  return <AuthLayout>{children}</AuthLayout>;
}
