import * as React from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Layout } from "@/components/ui/layout";
import { Modal } from "@/components/ui/modal";
import { ProductDetailsCard } from "@/components/ui/product-details-card";
import { ProductList } from "@/components/ui/product-list";
import { getBeautifulNumber } from "@/homeworks/ts1/1_base";
import { createRandomProduct } from "@/homeworks/ts1/3_write";
import type { Product } from "@/homeworks/ts1/3_write";

const INITIAL_PRODUCTS_COUNT = 12;
const PRODUCTS_STEP = 12;
const MAX_PRODUCTS_COUNT = 120;

const createProductBatch = (count: number): Product[] =>
  Array.from({ length: count }, (_, index) =>
    createRandomProduct(new Date(Date.now() + index).toISOString()),
  );

const formatPrice = (price: number): string =>
  `${getBeautifulNumber(price.toFixed(2))} ₽`;

function App() {
  const [products, setProducts] = React.useState<Product[]>(() =>
    createProductBatch(INITIAL_PRODUCTS_COUNT),
  );
  const [cartCounts, setCartCounts] = React.useState<Record<string, number>>(
    {},
  );
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null,
  );
  const [isPending, startTransition] = React.useTransition();

  const hasMoreProducts = products.length < MAX_PRODUCTS_COUNT;
  const totalItemsInCart = Object.values(cartCounts).reduce(
    (total, count) => total + count,
    0,
  );

  const handleLoadMore = () => {
    if (!hasMoreProducts || isPending) {
      return;
    }

    startTransition(() => {
      setProducts((currentProducts) => {
        const remainingProducts = MAX_PRODUCTS_COUNT - currentProducts.length;

        if (remainingProducts <= 0) {
          return currentProducts;
        }

        return [
          ...currentProducts,
          ...createProductBatch(Math.min(PRODUCTS_STEP, remainingProducts)),
        ];
      });
    });
  };

  const handleCartIncrement = (productId: string) => {
    setCartCounts((currentCounts) => ({
      ...currentCounts,
      [productId]: (currentCounts[productId] ?? 0) + 1,
    }));
  };

  const handleCartDecrement = (productId: string) => {
    setCartCounts((currentCounts) => ({
      ...currentCounts,
      [productId]: Math.max(0, (currentCounts[productId] ?? 0) - 1),
    }));
  };

  const headerStats = (
    <div className="flex flex-col items-center text-center text-xs font-medium leading-5 text-muted-foreground sm:text-sm">
      <span>Отрисовано: {products.length}</span>
      <span>
        {hasMoreProducts
          ? `Осталось: ${MAX_PRODUCTS_COUNT - products.length}`
          : "Все показано"}
      </span>
      <span>В корзине: {totalItemsInCart}</span>
    </div>
  );

  return (
    <ThemeProvider>
      <Layout headerContent={headerStats}>
        <div className="space-y-8">
          <section className="rounded-3xl border bg-card p-8 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Каталог товаров
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Карточки генерируются на лету с помощью утилит из домашнего
              задания по TypeScript
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
              Список принимает массив данных, рендерит карточки и подгружает
              следующую пачку товаров при прокрутке через IntersectionObserver
            </p>
          </section>

          <ProductList
            products={products}
            cartCounts={cartCounts}
            onCartIncrement={handleCartIncrement}
            onCartDecrement={handleCartDecrement}
            onProductSelect={setSelectedProduct}
            onLoadMore={handleLoadMore}
            hasMore={hasMoreProducts}
            isLoadingMore={isPending}
            formatPrice={formatPrice}
          />
        </div>

        <Modal
          visible={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          className="max-h-[calc(100vh-2rem)] w-[min(96vw,72rem)] max-w-none gap-0 overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:max-w-none data-[state=open]:slide-in-from-bottom-6 data-[state=open]:duration-300"
          // className="max-h-[calc(100vh-2rem)] w-[min(96vw,38rem)] sm:w-[min(92vw,32rem)] md:w-[min(92vw,38rem)] lg:w-[min(94vw,24rem)] xl:w-[min(96vw,72rem)] max-w-none gap-0 overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:max-w-none data-[state=open]:slide-in-from-bottom-6 data-[state=open]:duration-300"
          hideHeader
        >
          {selectedProduct ? (
            <ProductDetailsCard
              category={selectedProduct.category.name}
              title={selectedProduct.name}
              description={
                selectedProduct.desc ??
                "Товар создан через переиспользуемый генератор случайных данных."
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
              cartCount={cartCounts[selectedProduct.id] ?? 0}
              onCartIncrement={() => handleCartIncrement(selectedProduct.id)}
              onCartDecrement={() => handleCartDecrement(selectedProduct.id)}
              className="max-w-none animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300"
            />
          ) : null}
        </Modal>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
