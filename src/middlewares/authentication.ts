import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import cookie from "cookie";
import { jwtVerify } from "jose";

import { setTokensInCookies } from "@/utils/setTokensInCookies";

export async function authenticationMiddleware(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.JWT_SECRET)
    ); // Verify the JWT token

    return NextResponse.next(); // Token is valid, proceed
  } catch (error) {
    if ((error as Error).name === "JWTExpired") {
      if (!refreshToken) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Token is expired, attempt to refresh
      try {
        const refreshResponse = await fetch(
          new URL("/api/auth/refresh", request.url),
          {
            method: "POST",
            headers: {
              Cookie: `refreshToken=${refreshToken}`, // Manually add the refreshToken cookie to the request
            },
          }
        );

        if (!refreshResponse.ok) {
          return NextResponse.redirect(new URL("/login", request.url));
        }

        // Split the set-cookie header into individual cookies
        const setCookieHeader = refreshResponse.headers.get("set-cookie");
        const cookiesArray = setCookieHeader ? setCookieHeader.split(",") : [];

        let newAccessToken = "";
        let newRefreshToken = "";

        cookiesArray.forEach((cookieStr) => {
          const parsedCookie = cookie.parse(cookieStr);
          if (parsedCookie.accessToken) {
            newAccessToken = parsedCookie.accessToken;
          }
          if (parsedCookie.refreshToken) {
            newRefreshToken = parsedCookie.refreshToken;
          }
        });

        if (!newAccessToken || !newRefreshToken) {
          return NextResponse.redirect(new URL("/login", request.url));
        }

        // Update the cookies with the new tokens
        const response = NextResponse.next();

        setTokensInCookies(response, {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        return response;
      } catch (refreshError) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
