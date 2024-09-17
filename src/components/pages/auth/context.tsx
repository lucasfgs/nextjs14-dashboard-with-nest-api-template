import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const AuthContext = createContext<{
  email: string | null;
  setEmail: Dispatch<SetStateAction<string | null>>;
  confirmationCode: string | null;
  setConfirmationCode: Dispatch<SetStateAction<string | null>>;
} | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Auth context must be rendered within a component");
  }
  return context;
}
