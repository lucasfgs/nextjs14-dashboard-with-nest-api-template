import { NextRequest } from "next/server";

import { authenticationMiddleware } from "./middlewares/authentication";

export async function middleware(request: NextRequest) {
  const response = await authenticationMiddleware(request); // Check if the user is authenticated before proceeding

  return response;
}

// Apply the middleware to protected routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
