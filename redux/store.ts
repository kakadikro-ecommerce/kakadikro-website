import { configureStore } from "@reduxjs/toolkit";
import { injectStore } from "@/lib/axios";

import cartReducer from "@/redux/slice/cartSlice";
import orderReducer from "@/redux/slice/orderSlice";
import productReducer from "@/redux/slice/productSlice";
import userReducer from "@/redux/slice/userSlice";
import contactReducer from "@/redux/slice/contactSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    order: orderReducer,
    user: userReducer,
    contact: contactReducer,
  },
});

injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
