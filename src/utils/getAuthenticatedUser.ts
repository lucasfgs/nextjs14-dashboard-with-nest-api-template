"use server";
import { headers } from "next/headers";

import { IAuthenticatedUser } from "@/components/providers/authentication";

export async function getAuthenticatedUser(): Promise<IAuthenticatedUser | null> {
  const headersList = headers();

  if (!headersList.get("X-Authenticated-User")) return null;

  const authenticatedUser = JSON.parse(
    String(headersList.get("X-Authenticated-User"))
  );

  return authenticatedUser;
}
