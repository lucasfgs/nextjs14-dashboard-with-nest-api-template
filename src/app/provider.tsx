"use client";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ThemeProvider } from "@/components/providers/theme";
import { QueryClientProviderWrapper } from "@/components/providers/query-client";

interface ProviderProps {
  children: React.ReactNode;
}

function Provider({ children }: ProviderProps) {
  return (
    <>
      <QueryClientProviderWrapper>
        <ThemeProvider>{children}</ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProviderWrapper>
    </>
  );
}

export { Provider };
