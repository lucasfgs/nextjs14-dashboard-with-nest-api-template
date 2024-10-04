import React, { createContext, useContext, useEffect, useState } from "react";

import useSocket from "@/services/socket/use-socket";

type TPermission = {
  name: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export interface IAuthenticatedUser {
  sub: string;
  email: string;
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

  const [user, setUser] = useState<IAuthenticatedUser | null>(
    authenticatedUser
  );
  const [permissions, setPermissions] = useState<TPermission[] | null>(
    authenticatedUser?.permissions || null
  );

  useEffect(() => {
    listenToEvent("roles:update", (data: { permissions: TPermission[] }) => {
      console.log("ROLES UPDATED: ", data);
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
