import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CartItem } from "@/types/product";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId && item.variant.weight === action.payload.variant.weight
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        return;
      }

      state.items.push(action.payload);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.cartItemId !== action.payload);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ cartItemId: string; quantity: number }>
    ) => {
      const item = state.items.find((entry) => entry.cartItemId === action.payload.cartItemId);

      if (!item) {
        return;
      }

      item.quantity = Math.max(1, action.payload.quantity);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
