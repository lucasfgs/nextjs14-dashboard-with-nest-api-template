import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Assume you send these credentials to your auth backend and get the tokens
  try {
    const response = await fetch(`${process.env.API_URL}/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const { accessToken, refreshToken } = await response.json();

    // Set accessToken in a readable cookie and refreshToken in HttpOnly cookie
    const res = NextResponse.json({ message: "Login successful" });

    // Store the accessToken in a client-readable cookie
    res.cookies.set("accessToken", accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Store the refreshToken in an HTTP-only cookie (server-only)
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Login failed", error },
      { status: 401 }
    );
  }
}
