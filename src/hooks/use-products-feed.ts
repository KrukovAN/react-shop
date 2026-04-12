import * as React from "react";
import { PRODUCTS_BATCH_SIZE, loadRandomProductsBatch } from "@/lib/products-api";
import type { Product } from "@/types/shop";

type UseProductsFeedResult = {
  products: Product[];
  isLoadingMore: boolean;
  loadError: string | null;
  loadMore: () => Promise<void>;
};

function useProductsFeed(): UseProductsFeedResult {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const pendingRequestRef = React.useRef<AbortController | null>(null);
  const isLoadingMoreRef = React.useRef(false);

  const loadMore = React.useCallback(async () => {
    if (isLoadingMoreRef.current) {
      return;
    }

    const requestController = new AbortController();

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    setLoadError(null);
    pendingRequestRef.current = requestController;

    try {
      const nextProducts = await loadRandomProductsBatch(
        requestController.signal,
        PRODUCTS_BATCH_SIZE,
      );

      setProducts((currentProducts) => [...currentProducts, ...nextProducts]);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setLoadError(
        error instanceof Error ? error.message : "Не удалось загрузить товары.",
      );
    } finally {
      if (pendingRequestRef.current === requestController) {
        pendingRequestRef.current = null;
      }

      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, []);

  React.useEffect(() => {
    void loadMore();

    return () => {
      pendingRequestRef.current?.abort();
    };
  }, [loadMore]);

  return {
    products,
    isLoadingMore,
    loadError,
    loadMore,
  };
}

export { useProductsFeed };
export type { UseProductsFeedResult };
