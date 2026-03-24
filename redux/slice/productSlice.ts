import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
} from "@/redux/api/productApi";
import type { Product } from "@/types/product";

interface CategoryBucket {
  items: Product[];
  loading: boolean;
  error: string | null;
}

interface ProductState {
  items: Product[];
  categorizedItems: Record<string, CategoryBucket>;
  selectedProduct: Product | null;
  loading: boolean;
  selectedLoading: boolean;
  error: string | null;
  selectedError: string | null;
}

const initialState: ProductState = {
  items: [],
  categorizedItems: {},
  selectedProduct: null,
  loading: false,
  selectedLoading: false,
  error: null,
  selectedError: null,
};

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllProducts();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch products.";

      return rejectWithValue(message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk<
  { category: string; items: Product[] },
  string,
  { rejectValue: string }
>("products/fetchProductsByCategory", async (category, { rejectWithValue }) => {
  try {
    const items = await getProductsByCategory(category);
    return { category, items };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch category products.";

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch products.";
      })
      .addCase(fetchProductsByCategory.pending, (state, action) => {
        const category = action.meta.arg;
        state.categorizedItems[category] = {
          items: state.categorizedItems[category]?.items ?? [],
          loading: true,
          error: null,
        };
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.categorizedItems[action.payload.category] = {
          items: action.payload.items,
          loading: false,
          error: null,
        };
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        const category = action.meta.arg;
        state.categorizedItems[category] = {
          items: state.categorizedItems[category]?.items ?? [],
          loading: false,
          error: action.payload ?? "Failed to fetch category products.",
        };
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

export const { clearSelectedProduct } = productSlice.actions;

export default productSlice.reducer;
