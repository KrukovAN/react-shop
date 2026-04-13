import * as React from "react";
import type { AuthRole } from "@/app/routes";

type UseAuthSessionResult = {
  isAuthenticated: boolean;
  role: AuthRole;
  isAdmin: boolean;
  authLabel: string;
  login: () => void;
  logout: () => void;
  becomeAdmin: () => void;
  becomeUser: () => void;
};

function useAuthSession(onLogout?: () => void): UseAuthSessionResult {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [role, setRole] = React.useState<AuthRole>("user");

  const login = React.useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const logout = React.useCallback(() => {
    setIsAuthenticated(false);
    setRole("user");
    onLogout?.();
  }, [onLogout]);

  const becomeAdmin = React.useCallback(() => {
    setRole("admin");
  }, []);

  const becomeUser = React.useCallback(() => {
    setRole("user");
  }, []);

  const isAdmin = isAuthenticated && role === "admin";

  const authLabel = React.useMemo(() => {
    if (!isAuthenticated) {
      return "Гость";
    }

    return isAdmin ? "Админ" : "Пользователь";
  }, [isAdmin, isAuthenticated]);

  return {
    isAuthenticated,
    role,
    isAdmin,
    authLabel,
    login,
    logout,
    becomeAdmin,
    becomeUser,
  };
}

export { useAuthSession };
export type { UseAuthSessionResult };
