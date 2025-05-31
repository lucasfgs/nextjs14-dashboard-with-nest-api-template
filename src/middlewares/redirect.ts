import { NextRequest, NextResponse } from "next/server";

export async function redirectMiddleware(request: NextRequest) {
  const url = request.nextUrl.clone().toString();
  const reqHeaders = new Headers(request.headers);
  reqHeaders.set("x-url", url);

  return NextResponse.next({
    request: { headers: reqHeaders },
  });
}

export const redirectMiddlewareMatcher = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/confirm-email",
  "/confirm-code",
];
