import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  PRODUCTS_BATCH_SIZE,
  loadRandomProductsBatch,
} from "@/lib/products-api";
import type { Product } from "@/types/shop";

type ProductsState = {
  items: Product[];
  isLoadingMore: boolean;
  loadError: string | null;
};

type LoadMoreProductsThunkConfig = {
  state: {
    products: ProductsState;
  };
  rejectValue: string;
};

const initialState: ProductsState = {
  items: [],
  isLoadingMore: false,
  loadError: null,
};

const loadMoreProducts = createAsyncThunk<
  Product[],
  void,
  LoadMoreProductsThunkConfig
>(
  "products/loadMore",
  async (_, { rejectWithValue, signal }) => {
    try {
      return await loadRandomProductsBatch(signal, PRODUCTS_BATCH_SIZE);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return rejectWithValue("aborted");
      }

      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to load products.",
      );
    }
  },
  {
    condition: (_, { getState }) => !getState().products.isLoadingMore,
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.items = [action.payload, ...state.items];
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.items.findIndex(
        (product) => product.id === action.payload.id,
      );

      if (index < 0) {
        return;
      }

      state.items[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMoreProducts.pending, (state) => {
        state.isLoadingMore = true;
        state.loadError = null;
      })
      .addCase(loadMoreProducts.fulfilled, (state, action) => {
        state.items = [...state.items, ...action.payload];
        state.isLoadingMore = false;
      })
      .addCase(loadMoreProducts.rejected, (state, action) => {
        state.isLoadingMore = false;
        if (action.payload === "aborted") {
          return;
        }

        state.loadError =
          action.payload ?? action.error.message ?? "Failed to load products.";
      });
  },
});

const { addProduct, updateProduct } = productsSlice.actions;
const productsReducer = productsSlice.reducer;

export { addProduct, loadMoreProducts, productsReducer, updateProduct };
export type { ProductsState };
