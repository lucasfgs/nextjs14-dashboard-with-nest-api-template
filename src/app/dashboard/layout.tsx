import type { Metadata } from "next";

import DashboardLayout from "@/components/pages/dashboard/_layout";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard page",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const authenticatedUser = await validateAuthenticatedUser();

  // if (!authenticatedUser) {
  //   redirect("/login");
  // }

  return <DashboardLayout>{children}</DashboardLayout>;
}
