// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { authenticationMiddleware } from "./middlewares/authentication";
import { redirectMiddleware } from "./middlewares/redirect";
import { redirectMiddlewareMatcher } from "./middlewares/redirect";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/dashboard")) {
    return authenticationMiddleware(request);
  }

  if (redirectMiddlewareMatcher.includes(path)) {
    return redirectMiddleware(request);
  }

  return NextResponse.next();
}
