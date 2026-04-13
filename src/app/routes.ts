export const ROUTES = {
  products: "/",
  legacyProducts: "/products",
  profile: "/profile",
  cart: "/cart",
  admin: "/admin",
  auth: "/auth",
} as const;

export type AuthRole = "user" | "admin";
export type AuthGuardReason = "auth" | "admin";

export type AuthRouteState = {
  from?: string;
  reason?: AuthGuardReason;
};
