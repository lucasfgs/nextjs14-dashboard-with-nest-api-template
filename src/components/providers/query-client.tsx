"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/getQueryClient";

export function QueryClientProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // When this component mounts in the browser, `getQueryClient()` returns the same instance.
  // When this component is called as part of an RSC render on the server, getQueryClient()
  // returns a brand-new object for that render.
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
