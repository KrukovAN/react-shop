import * as React from "react";
import type { Product } from "@/types/shop";
import { cn } from "@/lib/utils";
import { CompactProductCard } from "./compact-product-card";

type ProductListProps = {
  products: Product[];
  cartCounts?: Record<string, number>;
  onCartIncrement?: (productId: string) => void;
  onCartDecrement?: (productId: string) => void;
  onProductSelect?: (product: Product) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  formatPrice?: (price: number) => React.ReactNode;
  className?: string;
};

function ProductList({
  products,
  cartCounts = {},
  onCartIncrement,
  onCartDecrement,
  onProductSelect,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  formatPrice,
  className,
}: ProductListProps) {
  const observerTargetRef = React.useRef<HTMLDivElement | null>(null);
  const canAutoLoadRef = React.useRef(true);
  const lastProductCountRef = React.useRef(products.length);

  React.useEffect(() => {
    if (products.length !== lastProductCountRef.current) {
      canAutoLoadRef.current = true;
      lastProductCountRef.current = products.length;
    }
  }, [products.length]);

  React.useEffect(() => {
    if (!hasMore || !onLoadMore || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const node = observerTargetRef.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || isLoadingMore || !canAutoLoadRef.current) {
          return;
        }

        canAutoLoadRef.current = false;
        onLoadMore();
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore, products.length]);

  return (
    <section className={cn("space-y-6", className)}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="flex h-full flex-col">
            <CompactProductCard
              title={product.name}
              description={product.desc ?? "Новая позиция каталога."}
              price={formatPrice ? formatPrice(product.price) : product.price}
              imageSrc={product.photo}
              imageAlt={product.name}
              onImageClick={
                onProductSelect ? () => onProductSelect(product) : undefined
              }
              imageActionLabel={`Открыть детали товара ${product.name}`}
              cartCount={cartCounts[product.id] ?? 0}
              onCartIncrement={() => onCartIncrement?.(product.id)}
              onCartDecrement={() => onCartDecrement?.(product.id)}
              className="max-w-none"
            />
          </div>
        ))}
      </div>

      {(hasMore || isLoadingMore) && onLoadMore ? (
        <div className="flex flex-col items-center gap-3 py-2">
          <div
            ref={observerTargetRef}
            className="h-6 w-full"
            aria-hidden="true"
          />
          {isLoadingMore ? (
            <p className="text-sm text-muted-foreground">Загрузка товаров...</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export { ProductList };
export type { ProductListProps };
