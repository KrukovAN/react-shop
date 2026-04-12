import * as React from "react";
import { CartProvider, useCart } from "@/components/providers/cart-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Layout } from "@/components/ui/layout";
import { Modal } from "@/components/ui/modal";
import { ProductDetailsCard } from "@/components/ui/product-details-card";
import { ProductList } from "@/components/ui/product-list";
import { useProductsFeed } from "@/hooks/use-products-feed";
import { getBeautifulNumber } from "@/lib/number-format";
import type { Product } from "@/types/shop";

const formatPrice = (price: number): string =>
  `${getBeautifulNumber(price.toFixed(2))} ₽`;

function CatalogPage() {
  const { totalItems } = useCart();
  const { products, isLoadingMore, loadError, loadMore } = useProductsFeed();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const handleRetry = React.useCallback(() => {
    void loadMore();
  }, [loadMore]);

  const headerStats = (
    <div className="flex flex-col items-center text-center text-xs font-medium leading-5 text-muted-foreground sm:text-sm">
      <span>Отрисовано: {products.length}</span>
      <span>Лента: бесконечная</span>
      <span>В корзине: {totalItems}</span>
    </div>
  );

  return (
    <Layout headerContent={headerStats}>
      <div className="space-y-8">
        <section className="rounded-3xl border bg-card p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Каталог товаров
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Бесконечная лента со случайными товарами
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
            При прокрутке подгружается новая пачка карточек. Изображения
            выбираются случайно из диапазона product-001.jpg ... product-999.jpg.
          </p>
        </section>

        {loadError ? (
          <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">{loadError}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-3 inline-flex h-9 items-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Повторить загрузку
            </button>
          </section>
        ) : null}

        <ProductList
          products={products}
          onProductSelect={setSelectedProduct}
          onLoadMore={loadMore}
          hasMore
          isLoadingMore={isLoadingMore}
          formatPrice={formatPrice}
        />
      </div>

      <Modal
        visible={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        className="max-h-[calc(100vh-2rem)] w-[min(96vw,72rem)] max-w-none gap-0 overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:max-w-none data-[state=open]:slide-in-from-bottom-6 data-[state=open]:duration-300"
        hideHeader
      >
        {selectedProduct ? (
          <ProductDetailsCard
            productId={selectedProduct.id}
            category={selectedProduct.category.name}
            title={selectedProduct.name}
            description={
              selectedProduct.desc ??
              "Карточка подгружена из бесконечной ленты."
            }
            price={
              <div className="flex flex-wrap items-center gap-3">
                <span>{formatPrice(selectedProduct.price)}</span>
                {selectedProduct.oldPrice ? (
                  <span className="text-base font-medium text-muted-foreground line-through">
                    {formatPrice(selectedProduct.oldPrice)}
                  </span>
                ) : null}
              </div>
            }
            imageSrc={selectedProduct.photo}
            imageAlt={selectedProduct.name}
            className="max-w-none animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300"
          />
        ) : null}
      </Modal>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <CatalogPage />
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
