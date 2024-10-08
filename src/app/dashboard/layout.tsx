import type { Metadata } from "next";

import DashboardLayout from "@/components/pages/dashboard/_layout";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";

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
  const authenticatedUser = await getAuthenticatedUser();

  return (
    <Provider authenticatedUser={authenticatedUser}>
      <DashboardLayout>{children}</DashboardLayout>
    </Provider>
  );
}
