import * as React from "react";
import { AppRouter } from "@/app/app-router";
import { ROUTES } from "@/app/routes";
import { AppHeaderActions } from "@/components/app/app-header-actions";
import { AppHeaderNav } from "@/components/app/app-header-nav";
import { useCart } from "@/components/providers/cart-provider";
import { Layout } from "@/components/ui/layout";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useProductsFeed } from "@/hooks/use-products-feed";
import type { CartListProduct } from "@/types/cart";

function App() {
  const { counts, totalItems, increment, decrement, remove, clear } = useCart();
  const { products, isLoadingMore, loadError, loadMore } = useProductsFeed();

  const {
    isSessionReady,
    isAuthenticated,
    isAdmin,
    authLabel,
    login,
    logout,
    becomeAdmin,
    becomeUser,
  } = useAuthSession(clear);

  const cartItems = React.useMemo<CartListProduct[]>(
    () =>
      products
        .filter((product) => (counts[product.id] ?? 0) > 0)
        .map((product) => ({
          id: product.id,
          title: product.name,
          price: product.price,
          imageSrc: product.photo,
          imageAlt: product.name,
          quantity: counts[product.id] ?? 0,
        })),
    [counts, products],
  );

  if (!isSessionReady) {
    return (
      <Layout
        headerContent={<AppHeaderNav isAdmin={false} />}
        headerActions={
          <AppHeaderActions
            authLabel="Загрузка"
            isAuthenticated={false}
            totalItems={0}
            authRoute={ROUTES.auth}
            cartRoute={ROUTES.cart}
            onLogout={logout}
          />
        }
      >
        <section className="py-10 text-sm text-muted-foreground">
          Инициализация приложения...
        </section>
      </Layout>
    );
  }

  return (
    <Layout
      headerContent={<AppHeaderNav isAdmin={isAdmin} />}
      headerActions={
        <AppHeaderActions
          authLabel={authLabel}
          isAuthenticated={isAuthenticated}
          totalItems={totalItems}
          authRoute={ROUTES.auth}
          cartRoute={ROUTES.cart}
          onLogout={logout}
        />
      }
    >
      <AppRouter
        products={products}
        isLoadingMore={isLoadingMore}
        loadError={loadError}
        onLoadMore={loadMore}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        cartItems={cartItems}
        totalItems={totalItems}
        onCartIncrement={increment}
        onCartDecrement={decrement}
        onCartRemove={remove}
        onLogin={login}
        onLogout={logout}
        onBecomeAdmin={becomeAdmin}
        onBecomeUser={becomeUser}
      />
    </Layout>
  );
}

export default App;
