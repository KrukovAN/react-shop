import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "@/store/slices/app-slice";
import { authReducer } from "@/store/slices/auth-slice";
import { cartReducer } from "@/store/slices/cart-slice";
import { productsReducer } from "@/store/slices/products-slice";
import { profileReducer } from "@/store/slices/profile-slice";

const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    profile: profileReducer,
    cart: cartReducer,
    products: productsReducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export { store };
export type { AppDispatch, RootState };
