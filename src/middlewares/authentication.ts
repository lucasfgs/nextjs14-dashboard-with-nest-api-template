// src/middleware/authentication.ts
import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { jwtVerify, JWTPayload } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function authenticationMiddleware(request: NextRequest) {
  const { headers, nextUrl } = request;
  const loginUrl = new URL(`${process.env.APP_PREFIX}/login`, nextUrl);

  // Parse incoming cookies
  const cookieHeader = headers.get("cookie") || "";
  const { accessToken, refreshToken } = parse(cookieHeader);

  // If we have an accessToken, verify it locally
  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, SECRET);
      // Valid → forward and attach user payload
      const response = NextResponse.next();
      response.headers.set(
        "x-authenticated-user",
        JSON.stringify(payload as JWTPayload)
      );
      return response;
    } catch (error) {
      // Token invalid or expired → fall through to refresh logic
    }
  }

  // No valid accessToken → must have a refreshToken
  if (!refreshToken) {
    return NextResponse.redirect(loginUrl);
  }

  // Attempt silent refresh
  const refreshResponse = await fetch(`${process.env.API_URL}/auth/refresh`, {
    method: "POST",
    headers: { Cookie: cookieHeader },
    credentials: "include",
  });

  // If refresh failed → clear both cookies & redirect to login
  if (!refreshResponse.ok) {
    const redirectRes = NextResponse.redirect(loginUrl);
    redirectRes.cookies.delete("accessToken");
    redirectRes.cookies.delete("refreshToken");
    return redirectRes;
  }

  // Otherwise, propagate Set-Cookie headers so browser updates cookies
  const proxyRes = NextResponse.next();
  const setCookieHeader = refreshResponse.headers.get("set-cookie");
  if (setCookieHeader) {
    for (const cookieStr of setCookieHeader.split(",")) {
      proxyRes.headers.append("Set-Cookie", cookieStr.trim());
    }
  }

  const user = await refreshResponse.json();
  proxyRes.headers.set("x-authenticated-user", JSON.stringify(user));

  return proxyRes;
}
