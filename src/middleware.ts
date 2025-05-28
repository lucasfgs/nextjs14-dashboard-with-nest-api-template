import { NextRequest } from "next/server";

import { authenticationMiddleware } from "./middlewares/authentication";

export async function middleware(request: NextRequest) {
  return authenticationMiddleware(request);
}

// Apply the middleware only to /dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
