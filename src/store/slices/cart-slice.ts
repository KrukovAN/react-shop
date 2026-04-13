import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type CartCounts = Record<string, number>;

type CartState = {
  counts: CartCounts;
};

type ProductIdPayload = {
  productId: string;
};

type SetCartItemCountPayload = ProductIdPayload & {
  count: number;
};

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

const initialState: CartState = {
  counts: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state, action: PayloadAction<CartCounts>) {
      state.counts = action.payload;
    },
    incrementCartItem(state, action: PayloadAction<ProductIdPayload>) {
      const currentCount = state.counts[action.payload.productId] ?? 0;
      state.counts = setItemCount(
        state.counts,
        action.payload.productId,
        currentCount + 1,
      );
    },
    decrementCartItem(state, action: PayloadAction<ProductIdPayload>) {
      const currentCount = state.counts[action.payload.productId] ?? 0;
      state.counts = setItemCount(
        state.counts,
        action.payload.productId,
        currentCount - 1,
      );
    },
    setCartItemCount(state, action: PayloadAction<SetCartItemCountPayload>) {
      state.counts = setItemCount(
        state.counts,
        action.payload.productId,
        normalizeCount(action.payload.count),
      );
    },
    removeCartItem(state, action: PayloadAction<ProductIdPayload>) {
      state.counts = setItemCount(state.counts, action.payload.productId, 0);
    },
    clearCart(state) {
      state.counts = {};
    },
  },
});

const {
  clearCart,
  decrementCartItem,
  hydrateCart,
  incrementCartItem,
  removeCartItem,
  setCartItemCount,
} = cartSlice.actions;

const cartReducer = cartSlice.reducer;

export {
  cartReducer,
  clearCart,
  decrementCartItem,
  hydrateCart,
  incrementCartItem,
  removeCartItem,
  setCartItemCount,
};
export type { CartCounts, CartState };
