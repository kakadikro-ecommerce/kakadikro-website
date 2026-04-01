import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import * as cartApi from "@/redux/api/cartApi";
import type { CartSummary } from "@/types/product";

interface CartState extends CartSummary {
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  totalItems: 0,
  loading: false,
  actionLoading: false,
  error: null,
  isOpen: false,
};

const applyCartSummary = (state: CartState, summary: CartSummary) => {
  state.items = summary.items;
  state.subtotal = summary.subtotal;
  state.totalItems = summary.totalItems;
};

export const fetchCart = createAsyncThunk<
  CartSummary,
  void,
  { rejectValue: string }
>("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    return await cartApi.getMyCart();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch cart.";
    return rejectWithValue(message);
  }
});

export const addCartItem = createAsyncThunk<
  CartSummary,
  { productId: string; weight: string; quantity: number },
  { rejectValue: string }
>("cart/addCartItem", async (payload, { rejectWithValue }) => {
  try {
    return await cartApi.addItemToCart(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add item to cart.";
    return rejectWithValue(message);
  }
});

export const updateCartItem = createAsyncThunk<
  CartSummary,
  { itemId: string; quantity: number },
  { rejectValue: string }
>("cart/updateCartItem", async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    return await cartApi.updateCartItemQuantity(itemId, { quantity });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update cart item.";
    return rejectWithValue(message);
  }
});

export const removeCartItem = createAsyncThunk<
  CartSummary,
  string,
  { rejectValue: string }
>("cart/removeCartItem", async (itemId, { rejectWithValue }) => {
  try {
    return await cartApi.removeCartItem(itemId);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to remove cart item.";
    return rejectWithValue(message);
  }
});

export const clearCartItems = createAsyncThunk<
  CartSummary,
  void,
  { rejectValue: string }
>("cart/clearCartItems", async (_, { rejectWithValue }) => {
  try {
    return await cartApi.clearCart();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to clear cart.";
    return rejectWithValue(message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    resetCart: (state) => {
      applyCartSummary(state, initialState);
      state.error = null;
      state.loading = false;
      state.actionLoading = false;
      state.isOpen = false;
    },
    clearCartError: (state) => {
      state.error = null;
    },
    hydrateCartState: (state, action: PayloadAction<Partial<CartSummary>>) => {
      applyCartSummary(state, {
        items: action.payload.items ?? state.items,
        subtotal: action.payload.subtotal ?? state.subtotal,
        totalItems: action.payload.totalItems ?? state.totalItems,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        applyCartSummary(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch cart.";
      })
      .addCase(addCartItem.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        applyCartSummary(state, action.payload);
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to add item to cart.";
      })
      .addCase(updateCartItem.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        applyCartSummary(state, action.payload);
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to update cart item.";
      })
      .addCase(removeCartItem.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        applyCartSummary(state, action.payload);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to remove cart item.";
      })
      .addCase(clearCartItems.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(clearCartItems.fulfilled, (state, action) => {
        state.actionLoading = false;
        applyCartSummary(state, action.payload);
      })
      .addCase(clearCartItems.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to clear cart.";
      });
  },
});

export const {
  openCart,
  closeCart,
  toggleCart,
  resetCart,
  clearCartError,
  hydrateCartState,
} = cartSlice.actions;

export default cartSlice.reducer;
