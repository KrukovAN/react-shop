import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCart,
  decrementCartItem,
  hydrateCart,
  incrementCartItem,
  removeCartItem,
  setCartItemCount,
  type CartCounts,
} from "@/store/slices/cart-slice";

type CartContextValue = {
  counts: CartCounts;
  totalItems: number;
  getCount: (productId: string) => number;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  setCount: (productId: string, count: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

type CartProviderProps = {
  children: React.ReactNode;
  initialCounts?: CartCounts;
};

const CartContext = React.createContext<CartContextValue | null>(null);

function CartProvider({ children, initialCounts }: CartProviderProps) {
  const dispatch = useAppDispatch();
  const counts = useAppSelector((state) => state.cart.counts);

  React.useEffect(() => {
    if (!initialCounts || Object.keys(initialCounts).length === 0) {
      return;
    }

    dispatch(hydrateCart(initialCounts));
  }, [dispatch, initialCounts]);

  const totalItems = React.useMemo(
    () => Object.values(counts).reduce((sum, count) => sum + count, 0),
    [counts],
  );

  const getCount = React.useCallback(
    (productId: string) => counts[productId] ?? 0,
    [counts],
  );

  const increment = React.useCallback(
    (productId: string) => {
      dispatch(incrementCartItem({ productId }));
    },
    [dispatch],
  );

  const decrement = React.useCallback(
    (productId: string) => {
      dispatch(decrementCartItem({ productId }));
    },
    [dispatch],
  );

  const setCount = React.useCallback(
    (productId: string, count: number) => {
      dispatch(setCartItemCount({ productId, count }));
    },
    [dispatch],
  );

  const remove = React.useCallback(
    (productId: string) => {
      dispatch(removeCartItem({ productId }));
    },
    [dispatch],
  );

  const clear = React.useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const contextValue = React.useMemo(
    () => ({
      counts,
      totalItems,
      getCount,
      increment,
      decrement,
      setCount,
      remove,
      clear,
    }),
    [counts, totalItems, getCount, increment, decrement, setCount, remove, clear],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

function useCartOptional() {
  return React.useContext(CartContext);
}

function useCart() {
  const context = useCartOptional();

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}

export { CartProvider, useCart, useCartOptional };
export type { CartContextValue, CartProviderProps };
