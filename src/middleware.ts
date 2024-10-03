import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import cookie from "cookie";

export async function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value; // Get refreshToken from cookies

  if (!accessToken) {
    // No access token, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Validate the access token (or just forward the request if token is present)
    const response = await fetch(`${process.env.API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // Token is invalid, try to refresh using refreshToken
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
        // Failed to refresh, redirect to login
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Split the set-cookie header into individual cookies
      const setCookieHeader = refreshResponse.headers.get("set-cookie");
      const cookiesArray = setCookieHeader ? setCookieHeader.split(",") : [];

      // Parse each cookie and extract the tokens
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

      // Update accessToken in cookies
      const res = NextResponse.next();

      res.cookies.set("accessToken", newAccessToken, {
        httpOnly: false,
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
      });

      // Update refreshToken in cookies
      res.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return res;
    }

    return NextResponse.next(); // Proceed to the next step if token is valid
  } catch (error) {
    console.error("Error during token validation or refresh:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Apply the middleware to protected routes
export const config = {
  matcher: ["/dashboard/:path*"], // Specify routes for the middleware
};
