"use client";

import dynamic from "next/dynamic";

const DashboardLayout = dynamic(
  () => import("./_layout").then((mod) => mod.default),
  { ssr: false }
);

export default function VerticalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
