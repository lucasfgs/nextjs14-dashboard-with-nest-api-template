import type { Metadata } from "next";
import { headers } from "next/headers";

import DashboardLayout from "@/components/pages/dashboard/_layout";

import { Provider } from "./provider";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard page",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const authenticatedUser = JSON.parse(
    headersList.get("X-Authenticated-User") || "{}"
  );

  return (
    <Provider authenticatedUser={authenticatedUser}>
      <DashboardLayout>{children}</DashboardLayout>
    </Provider>
  );
}
