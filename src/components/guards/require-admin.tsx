import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES, type AuthGuardReason } from "@/app/routes";

type RequireAdminProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  children: React.ReactElement;
};

function RequireAdmin({
  isAuthenticated,
  isAdmin,
  children,
}: RequireAdminProps) {
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.auth}
        replace
        state={{ from: location.pathname, reason: "auth" satisfies AuthGuardReason }}
      />
    );
  }

  if (!isAdmin) {
    return (
      <Navigate
        to={ROUTES.auth}
        replace
        state={{ from: location.pathname, reason: "admin" satisfies AuthGuardReason }}
      />
    );
  }

  return children;
}

export { RequireAdmin };
export type { RequireAdminProps };
