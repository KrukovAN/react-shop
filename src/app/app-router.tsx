import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { RequireAdmin } from "@/components/guards/require-admin";
import { RequireAuth } from "@/components/guards/require-auth";
import { AdminPage } from "@/pages/admin-page";
import { AuthPage } from "@/pages/auth-page";
import { CartPage } from "@/pages/cart-page";
import { ProductsPage } from "@/pages/products-page";
import { ProfilePage } from "@/pages/profile-page";
import type { CartListProduct } from "@/types/cart";
import type { Product } from "@/types/shop";

type AppRouterProps = {
  products: Product[];
  isLoadingMore: boolean;
  loadError: string | null;
  onLoadMore: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  cartItems: CartListProduct[];
  totalItems: number;
  onCartIncrement: (productId: string) => void;
  onCartDecrement: (productId: string, quantity: number) => void;
  onCartRemove: (productId: string) => void;
  onLogin: () => void;
  onLogout: () => void;
  onBecomeAdmin: () => void;
  onBecomeUser: () => void;
};

function AppRouter({
  products,
  isLoadingMore,
  loadError,
  onLoadMore,
  isAuthenticated,
  isAdmin,
  cartItems,
  totalItems,
  onCartIncrement,
  onCartDecrement,
  onCartRemove,
  onLogin,
  onLogout,
  onBecomeAdmin,
  onBecomeUser,
}: AppRouterProps) {
  return (
    <Routes>
      <Route
        path={ROUTES.products}
        element={
          <ProductsPage
            products={products}
            isLoadingMore={isLoadingMore}
            loadError={loadError}
            onLoadMore={onLoadMore}
            isAdmin={isAdmin}
          />
        }
      />
      <Route
        path={ROUTES.legacyProducts}
        element={<Navigate to={ROUTES.products} replace />}
      />
      <Route
        path={ROUTES.profile}
        element={
          <RequireAuth isAuthenticated={isAuthenticated}>
            <ProfilePage />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.cart}
        element={
          <RequireAuth isAuthenticated={isAuthenticated}>
            <CartPage
              items={cartItems}
              totalItems={totalItems}
              onIncrement={onCartIncrement}
              onDecrement={onCartDecrement}
              onRemove={onCartRemove}
            />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.admin}
        element={
          <RequireAdmin isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
            <AdminPage />
          </RequireAdmin>
        }
      />
      <Route
        path={ROUTES.auth}
        element={
          <AuthPage
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            onLogin={onLogin}
            onLogout={onLogout}
            onBecomeAdmin={onBecomeAdmin}
            onBecomeUser={onBecomeUser}
          />
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.products} replace />} />
    </Routes>
  );
}

export { AppRouter };
export type { AppRouterProps };
