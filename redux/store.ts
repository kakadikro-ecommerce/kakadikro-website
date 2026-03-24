import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "@/redux/slice/cartSlice";
import productReducer from "@/redux/slice/productSlice";
import userReducer from "@/redux/slice/userSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
