import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import cookie from "cookie";

export async function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value; // Get refreshToken from cookies

  // Check if there's no access token
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify and decode the JWT locally without contacting the server
    await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    // If token is valid, proceed to the next step
    return NextResponse.next();
  } catch (error) {
    console.log("ERROR: ", error);
    // Token is invalid or expired, try to refresh using refreshToken
    if (
      (error as Error).name === "JWTExpired" ||
      (error as any).code === "ERR_JWT_EXPIRED"
    ) {
      if (!refreshToken) {
        1;
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
        const res = NextResponse.next();

        res.cookies.set("accessToken", newAccessToken, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24, // 1 day
        });

        res.cookies.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return res;
      } catch (refreshError) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } else {
      // Token is invalid for other reasons, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

// Apply the middleware to protected routes
export const config = {
  matcher: ["/dashboard/:path*"], // Specify routes for the middleware
};
