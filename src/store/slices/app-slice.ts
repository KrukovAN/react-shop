import { createSlice } from "@reduxjs/toolkit";

type AppState = {
  isInitialized: boolean;
};

const initialState: AppState = {
  isInitialized: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    markInitialized(state) {
      state.isInitialized = true;
    },
  },
});

const { markInitialized } = appSlice.actions;
const appReducer = appSlice.reducer;

export { appReducer, markInitialized };
export type { AppState };
