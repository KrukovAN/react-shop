import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES, type AuthGuardReason } from "@/app/routes";

type RequireAuthProps = {
  isAuthenticated: boolean;
  children: React.ReactElement;
};

function RequireAuth({ isAuthenticated, children }: RequireAuthProps) {
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

  return children;
}

export { RequireAuth };
export type { RequireAuthProps };
