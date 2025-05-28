import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";

export async function authenticationMiddleware(request: NextRequest) {
  const { nextUrl, headers } = request;
  const loginUrl = new URL(`${process.env.APP_PREFIX}/login`, nextUrl);

  // Parse the refreshToken
  const cookieHeader = headers.get("cookie") || "";
  const { refreshToken, accessToken } = cookie.parse(cookieHeader);

  // If no refreshToken cookie → redirect to login
  if (!refreshToken) {
    return NextResponse.redirect(loginUrl);
  }

  // If we have an accessToken, try to validate it first
  if (accessToken) {
    try {
      const meResponse = await fetch(`${process.env.API_URL}/auth/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (meResponse.ok) {
        const user = await meResponse.json();
        const response = NextResponse.next();
        response.headers.set("x-authenticated-user", JSON.stringify(user));
        return response;
      }
    } catch {}
  }

  try {
    const refreshResponse = await fetch(`${process.env.API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    });

    if (!refreshResponse.ok) {
      throw new Error("Refresh failed");
    }

    const user = await refreshResponse.json();

    const response = NextResponse.next();

    response.headers.set("x-authenticated-user", JSON.stringify(user));

    return response;
  } catch (error) {
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("refreshToken");
    response.cookies.delete("accessToken");
    return response;
  }
}
