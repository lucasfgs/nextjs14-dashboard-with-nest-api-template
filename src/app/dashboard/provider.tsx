"use client";
import React from "react";

import { WebSocketProvider } from "@/components/providers/websocket";
import {
  AuthenticationProvider,
  IAuthenticatedUser,
} from "@/components/providers/authentication";

interface ProviderProps {
  children: React.ReactNode;
  authenticatedUser: IAuthenticatedUser | null;
}

function Provider({ children, authenticatedUser }: ProviderProps) {
  return (
    <>
      <WebSocketProvider>
        <AuthenticationProvider authenticatedUser={authenticatedUser}>
          {children}
        </AuthenticationProvider>
      </WebSocketProvider>
    </>
  );
}

export { Provider };
