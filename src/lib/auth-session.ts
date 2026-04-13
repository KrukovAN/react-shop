import type { AuthRole } from "@/app/routes";
import type { AppProfile } from "@/types/profile";

const AUTH_TOKEN_STORAGE_KEY = "react-shop.auth.token";
const TOKEN_ROLE_INDEX = 1;

const isRole = (value: string): value is AuthRole =>
  value === "admin" || value === "user";

const normalizeToken = (value: string | null | undefined): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const token = value.trim();
  return token.length > 0 ? token : null;
};

const createTokenEntropy = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

const createFakeToken = (role: AuthRole): string =>
  `fake.${role}.${createTokenEntropy()}`;

const parseRoleFromToken = (token: string): AuthRole => {
  const role = token.split(".")[TOKEN_ROLE_INDEX] ?? "";
  return isRole(role) ? role : "user";
};

const buildFakeProfile = (token: string): AppProfile => {
  const role = parseRoleFromToken(token);
  const tokenSuffix = token.split(".").at(-1)?.slice(0, 8) ?? "session";
  const isAdmin = role === "admin";

  return {
    id: `usr_${tokenSuffix}`,
    firstName: isAdmin ? "Admin" : "Ivan",
    lastName: isAdmin ? "User" : "Ivanov",
    displayName: isAdmin ? "Administrator" : "Demo User",
    email: isAdmin
      ? `admin.${tokenSuffix}@example.com`
      : `user.${tokenSuffix}@example.com`,
    emailVerified: true,
    role,
  };
};

const readTokenFromStorage = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return normalizeToken(window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY));
  } catch {
    return null;
  }
};

const writeTokenToStorage = (token: string | null): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      return;
    }

    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    // localStorage may be disabled in private mode or restricted environments.
  }
};

export {
  AUTH_TOKEN_STORAGE_KEY,
  buildFakeProfile,
  createFakeToken,
  normalizeToken,
  parseRoleFromToken,
  readTokenFromStorage,
  writeTokenToStorage,
};
