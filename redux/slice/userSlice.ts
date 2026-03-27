import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser, UserState } from "@/types/user";

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    hydrateUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.currentUser = action.payload;
    },

    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.currentUser = action.payload;
    },

    updateUserProfile: (state, action: PayloadAction<{ name: string }>) => {
      if (state.currentUser) {
        state.currentUser.name = action.payload.name;
      }
    },

    logoutUser: (state) => {
      state.currentUser = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("kd-user");
        localStorage.removeItem("token");
      }
    },
  },
});

export const {
  hydrateUser,
  setUser,
  logoutUser,
  updateUserProfile,
} = userSlice.actions;

export default userSlice.reducer;