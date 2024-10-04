import { NextResponse } from "next/server";

export const setTokensInCookies = (
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string }
) => {
  response.cookies.set("accessToken", tokens.accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
  });

  response.cookies.set("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
};
