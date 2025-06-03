import type { Metadata } from "next";

import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import HorizontalLayout from "@/components/pages/dashboard/layouts/horizontal";

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
      <HorizontalLayout>{children}</HorizontalLayout>
    </Provider>
  );
}
