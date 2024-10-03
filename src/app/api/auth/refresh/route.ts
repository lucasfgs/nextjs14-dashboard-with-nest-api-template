import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "No refresh token available" },
      { status: 401 }
    );
  }

  // Use the refresh token to get a new access token
  try {
    const response = await fetch(`${process.env.API_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const data = await response.json();

    if (!data.accessToken || !data.refreshToken) {
      return NextResponse.json(
        { message: "Failed to refresh token" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ message: "Token refreshed" });

    // Update accessToken in cookies
    res.cookies.set("accessToken", data.accessToken, {
      httpOnly: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Update refreshToken in cookies
    res.cookies.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to refresh token", error },
      { status: 401 }
    );
  }
}
