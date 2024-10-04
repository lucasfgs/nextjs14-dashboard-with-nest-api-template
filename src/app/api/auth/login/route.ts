import { NextRequest, NextResponse } from "next/server";

import { setTokensInCookies } from "@/utils/setTokensInCookies";

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

    setTokensInCookies(res, { accessToken, refreshToken });

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Login failed", error },
      { status: 401 }
    );
  }
}
