import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadMoreProducts } from "@/store/slices/products-slice";
import type { Product } from "@/types/shop";

type UseProductsFeedResult = {
  products: Product[];
  isLoadingMore: boolean;
  loadError: string | null;
  loadMore: () => Promise<void>;
};

function useProductsFeed(): UseProductsFeedResult {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const isLoadingMore = useAppSelector((state) => state.products.isLoadingMore);
  const loadError = useAppSelector((state) => state.products.loadError);

  const loadMore = React.useCallback(async () => {
    try {
      await dispatch(loadMoreProducts()).unwrap();
    } catch {
      // Error state is already captured in the slice.
    }
  }, [dispatch]);

  React.useEffect(() => {
    if (products.length > 0 || isLoadingMore) {
      return;
    }

    void loadMore();
  }, [isLoadingMore, loadMore, products.length]);

  return {
    products,
    isLoadingMore,
    loadError,
    loadMore,
  };
}

export { useProductsFeed };
export type { UseProductsFeedResult };
