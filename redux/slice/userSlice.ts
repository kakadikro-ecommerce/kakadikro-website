import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
  email: string;
}

interface UserState {
  currentUser: UserProfile | null;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    hydrateUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.currentUser = action.payload;
    },
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.currentUser = action.payload;
    },
    logoutUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const { hydrateUser, setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
