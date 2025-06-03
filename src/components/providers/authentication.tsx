import React, { createContext, useContext, useEffect, useState } from "react";

import useSocket from "@/services/socket/use-socket";

export type TPermission = {
  name: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export interface IAuthenticatedUser {
  sub: string;
  email: string;
  name: string;
  permissions: TPermission[];
}

export interface AuthentcationProviderProps {
  children: React.ReactNode;
  authenticatedUser: IAuthenticatedUser | null;
}

interface AuhenticationContextProps {
  user: IAuthenticatedUser | null;
  permissions: TPermission[] | null;
}

export const AuthenticationContext = createContext<AuhenticationContextProps>({
  user: null,
  permissions: null,
});

export const AuthenticationProvider: React.FC<AuthentcationProviderProps> = ({
  children,
  authenticatedUser,
}) => {
  const { listenToEvent, sendEvent } = useSocket();

  // Initialize state with authenticatedUser
  const [user, setUser] = useState<IAuthenticatedUser | null>(null);
  const [permissions, setPermissions] = useState<TPermission[] | null>(null);

  // Set initial state after mount to avoid hydration mismatch
  useEffect(() => {
    setUser(authenticatedUser);
    setPermissions(authenticatedUser?.permissions || null);
  }, [authenticatedUser]);

  useEffect(() => {
    listenToEvent("roles:update", (data: { permissions: TPermission[] }) => {
      setPermissions(data.permissions);
    });
  }, [listenToEvent]);

  return (
    <AuthenticationContext.Provider value={{ user, permissions }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => {
  return useContext(AuthenticationContext);
};
