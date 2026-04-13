import * as React from "react";
import type { AuthRole } from "@/app/routes";
import {
  AUTH_TOKEN_STORAGE_KEY,
  buildFakeProfile,
  createFakeToken,
  normalizeToken,
  parseRoleFromToken,
  readTokenFromStorage,
  writeTokenToStorage,
} from "@/lib/auth-session";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { markInitialized } from "@/store/slices/app-slice";
import { setToken } from "@/store/slices/auth-slice";
import { clearCart } from "@/store/slices/cart-slice";
import { clearProfile, setProfile } from "@/store/slices/profile-slice";

type UseAuthSessionResult = {
  isSessionReady: boolean;
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
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const isInitialized = useAppSelector((state) => state.app.isInitialized);

  const isAuthenticated = token !== null;
  const role: AuthRole = token ? parseRoleFromToken(token) : "user";

  React.useEffect(() => {
    if (isInitialized) {
      return;
    }

    const storedToken = readTokenFromStorage();
    dispatch(setToken(storedToken));
    dispatch(markInitialized());
  }, [dispatch, isInitialized]);

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== AUTH_TOKEN_STORAGE_KEY) {
        return;
      }

      dispatch(setToken(normalizeToken(event.newValue)));
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [dispatch]);

  React.useEffect(() => {
    if (!isInitialized) {
      return;
    }

    writeTokenToStorage(token);

    if (!token) {
      dispatch(clearProfile());
      dispatch(clearCart());
      return;
    }

    dispatch(setProfile(buildFakeProfile(token)));
  }, [dispatch, isInitialized, token]);

  const login = React.useCallback(() => {
    dispatch(setToken(createFakeToken("user")));
  }, [dispatch]);

  const logout = React.useCallback(() => {
    dispatch(setToken(null));
    onLogout?.();
  }, [dispatch, onLogout]);

  const becomeAdmin = React.useCallback(() => {
    if (!isAuthenticated) {
      return;
    }

    dispatch(setToken(createFakeToken("admin")));
  }, [dispatch, isAuthenticated]);

  const becomeUser = React.useCallback(() => {
    if (!isAuthenticated) {
      return;
    }

    dispatch(setToken(createFakeToken("user")));
  }, [dispatch, isAuthenticated]);

  const isAdmin = isAuthenticated && role === "admin";

  const authLabel = React.useMemo(() => {
    if (!isAuthenticated) {
      return "Гость";
    }

    return isAdmin ? "Админ" : "Пользователь";
  }, [isAdmin, isAuthenticated]);

  return {
    isSessionReady: isInitialized,
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
