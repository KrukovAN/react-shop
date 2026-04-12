import * as React from "react";

type CartCounts = Record<string, number>;

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

type CartAction =
  | { type: "increment"; productId: string }
  | { type: "decrement"; productId: string }
  | { type: "set"; productId: string; count: number }
  | { type: "remove"; productId: string }
  | { type: "clear" };

const CartContext = React.createContext<CartContextValue | null>(null);

const normalizeCount = (count: number): number =>
  Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;

const setItemCount = (
  current: CartCounts,
  productId: string,
  nextCount: number,
): CartCounts => {
  if (nextCount <= 0) {
    if (!(productId in current)) {
      return current;
    }

    const nextState = { ...current };
    delete nextState[productId];
    return nextState;
  }

  if (current[productId] === nextCount) {
    return current;
  }

  return { ...current, [productId]: nextCount };
};

const cartReducer = (state: CartCounts, action: CartAction): CartCounts => {
  switch (action.type) {
    case "increment": {
      const currentCount = state[action.productId] ?? 0;
      return setItemCount(state, action.productId, currentCount + 1);
    }
    case "decrement": {
      const currentCount = state[action.productId] ?? 0;
      return setItemCount(state, action.productId, currentCount - 1);
    }
    case "set": {
      return setItemCount(state, action.productId, normalizeCount(action.count));
    }
    case "remove": {
      return setItemCount(state, action.productId, 0);
    }
    case "clear": {
      return Object.keys(state).length > 0 ? {} : state;
    }
    default: {
      return state;
    }
  }
};

function CartProvider({ children, initialCounts = {} }: CartProviderProps) {
  const [counts, dispatch] = React.useReducer(cartReducer, initialCounts);

  const totalItems = React.useMemo(
    () => Object.values(counts).reduce((sum, count) => sum + count, 0),
    [counts],
  );

  const getCount = React.useCallback(
    (productId: string) => counts[productId] ?? 0,
    [counts],
  );

  const increment = React.useCallback((productId: string) => {
    dispatch({ type: "increment", productId });
  }, []);

  const decrement = React.useCallback((productId: string) => {
    dispatch({ type: "decrement", productId });
  }, []);

  const setCount = React.useCallback((productId: string, count: number) => {
    dispatch({ type: "set", productId, count });
  }, []);

  const remove = React.useCallback((productId: string) => {
    dispatch({ type: "remove", productId });
  }, []);

  const clear = React.useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

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
