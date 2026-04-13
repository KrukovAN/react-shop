import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppProfile, ProfileFormValues } from "@/types/profile";

type ProfileState = {
  value: AppProfile | null;
};

const initialState: ProfileState = {
  value: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<AppProfile>) {
      state.value = action.payload;
    },
    clearProfile(state) {
      state.value = null;
    },
    updateProfile(state, action: PayloadAction<ProfileFormValues>) {
      if (!state.value) {
        return;
      }

      state.value = {
        ...state.value,
        ...action.payload,
      };
    },
  },
});

const { clearProfile, setProfile, updateProfile } = profileSlice.actions;
const profileReducer = profileSlice.reducer;

export { clearProfile, profileReducer, setProfile, updateProfile };
export type { ProfileState };
