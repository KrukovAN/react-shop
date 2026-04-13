import * as React from "react";
import { useInfiniteScrollTrigger } from "@/hooks/use-infinite-scroll-trigger";
import type { Product } from "@/types/shop";
import { cn } from "@/lib/utils";
import { CompactProductCard } from "./compact-product-card";

type ProductListProps = {
  products: Product[];
  onProductSelect?: (product: Product) => void;
  onLoadMore?: () => void | Promise<void>;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onProductEdit?: (product: Product) => void;
  formatPrice?: (price: number) => React.ReactNode;
  className?: string;
};

function ProductList({
  products,
  onProductSelect,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  onProductEdit,
  formatPrice,
  className,
}: ProductListProps) {
  const observerTargetRef = useInfiniteScrollTrigger({
    enabled: hasMore,
    isLoading: isLoadingMore,
    onLoadMore,
    resetToken: products.length,
  });

  const renderPrice = React.useCallback(
    (price: number) => (formatPrice ? formatPrice(price) : price),
    [formatPrice],
  );

  return (
    <section className={cn("space-y-6", className)}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="flex h-full flex-col">
            <CompactProductCard
              productId={product.id}
              title={product.name}
              description={product.desc ?? "Новая позиция каталога."}
              price={renderPrice(product.price)}
              imageSrc={product.photo}
              imageAlt={product.name}
              onImageClick={
                onProductSelect ? () => onProductSelect(product) : undefined
              }
              imageActionLabel={`Открыть детали товара ${product.name}`}
              onEdit={onProductEdit ? () => onProductEdit(product) : undefined}
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
