import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  getAllProducts,
  getProductBySlug,
} from "@/redux/api/productApi";
import type { Product } from "@/types/product";

interface ProductState {
  items: Product[];
  pagination: any;
  selectedProduct: Product | null;
  loading: boolean;
  selectedLoading: boolean;
  error: string | null;
  selectedError: string | null;
}

const initialState: ProductState = {
  items: [],
  pagination: null,
  selectedProduct: null,
  loading: false,
  selectedLoading: false,
  error: null,
  selectedError: null,
};

export const fetchProducts = createAsyncThunk<
  { items: Product[]; pagination: any },
  {
    search?: string;
    category?: string;
    productType?: "GROCERY" | "ELECTRONICS";
    page?: number;
    limit?: number;
  },
  { rejectValue: string }
>("products/fetchProducts", async (params, { rejectWithValue }) => {
  try {
    return await getAllProducts(params);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch products.";
    return rejectWithValue(message);
  }
});

export const fetchProductBySlug = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchProductBySlug", async (slug, { rejectWithValue }) => {
  try {
    return await getProductBySlug(slug);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch product details.";
    return rejectWithValue(message);
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.selectedError = null;
      state.selectedLoading = false;
    },
    upsertProduct: (state, action: PayloadAction<Product>) => {
      const next = action.payload;
      const key = next.id || next._id || next.slug;

      state.items = state.items.map((item) =>
        (item.id || item._id || item.slug) === key ? next : item
      );

      const selected = state.selectedProduct;
      if (
        selected &&
        (selected.slug === next.slug ||
          selected.id === next.id ||
          selected._id === next._id)
      ) {
        state.selectedProduct = next;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch products.";
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action: PayloadAction<Product>) => {
        state.selectedLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload ?? "Failed to fetch product details.";
      });
  },
});

export const { clearSelectedProduct, upsertProduct } = productSlice.actions;

export default productSlice.reducer;
