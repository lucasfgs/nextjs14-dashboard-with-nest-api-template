import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { validateAuthenticatedUser } from "@/utils/validateAuthenticatedUser";
import DashboardLayout from "@/components/pages/dashboard/_layout";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication page",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authenticatedUser = await validateAuthenticatedUser();

  if (!authenticatedUser) {
    redirect("/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
