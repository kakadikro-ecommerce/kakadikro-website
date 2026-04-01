import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser, UserState } from "@/types/user";

const initialState: UserState = {
  currentUser: null,
  accessToken: null,
  isAuthReady: false,
  isAuthChecking: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    hydrateUser: (
      state,
      action: PayloadAction<{
        currentUser: AuthUser | null;
        accessToken: string | null;
      }>
    ) => {
      state.currentUser = action.payload.currentUser;
      state.accessToken = action.payload.accessToken;
      state.isAuthReady = true;
    },

    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.currentUser = action.payload;
    },

    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },

    setAuthSession: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>
    ) => {
      state.currentUser = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthReady = true;
    },

    setAuthChecking: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecking = action.payload;
    },

    updateUserProfile: (state, action: PayloadAction<{ name: string }>) => {
      if (state.currentUser) {
        state.currentUser.name = action.payload.name;
      }
    },

    logoutUser: (state) => {
      state.currentUser = null;
      state.accessToken = null;
      state.isAuthReady = true;
      state.isAuthChecking = false;
    },
  },
});

export const {
  hydrateUser,
  setUser,
  setAccessToken,
  setAuthSession,
  setAuthChecking,
  logoutUser,
  updateUserProfile,
} = userSlice.actions;

export default userSlice.reducer;
