import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import cookie from "cookie";
import { jwtVerify, decodeJwt } from "jose"; // Import decode to extract user info

import { setTokensInCookies } from "@/utils/setTokensInCookies";

export async function authenticationMiddleware(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.next();

  try {
    await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.JWT_SECRET)
    ); // Verify the JWT token

    // Decode the token to get user info
    const user = decodeJwt(accessToken);

    // Set user information in a custom response header
    response.headers.set("X-Authenticated-User", JSON.stringify(user));

    return response; // Proceed with the response including user info
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
        setTokensInCookies(response, {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        // Decode the new access token to get user info
        const user = decodeJwt(newAccessToken);
        response.headers.set("X-Authenticated-User", JSON.stringify(user));

        return response;
      } catch (refreshError) {
        console.log("refreshError: ", refreshError);
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
