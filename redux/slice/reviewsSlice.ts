import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  createProductReview,
  deleteProductReview,
  getReviewsByProductId,
  type Review,
  updateProductReview,
} from "@/redux/api/reviewsApi";

interface ReviewsState {
  byProductId: Record<string, Review[]>;
  paginationByProductId: Record<string, any>;
  loadingByProductId: Record<string, boolean>;
  errorByProductId: Record<string, string | null>;
  mutationLoading: boolean;
  mutationError: string | null;
}

const initialState: ReviewsState = {
  byProductId: {},
  paginationByProductId: {},
  loadingByProductId: {},
  errorByProductId: {},
  mutationLoading: false,
  mutationError: null,
};

export const fetchReviewsByProductId = createAsyncThunk(
  "reviews/fetchByProductId",
  async ({ productId, page, limit }: { productId: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      return { productId, ...(await getReviewsByProductId(productId, { page, limit })) };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch reviews.");
    }
  }
);

export const submitReview = createAsyncThunk(
  "reviews/submit",
  async (payload: { productId: string; rating: number; comment?: string }, { rejectWithValue }) => {
    try {
      return await createProductReview(payload);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create review.");
    }
  }
);

export const editReview = createAsyncThunk(
  "reviews/edit",
  async ({ reviewId, payload }: { reviewId: string; payload: { rating?: number; comment?: string } }, { rejectWithValue }) => {
    try {
      return await updateProductReview(reviewId, payload);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update review.");
    }
  }
);

export const removeReview = createAsyncThunk(
  "reviews/remove",
  async (reviewId: string, { rejectWithValue }) => {
    try {
      await deleteProductReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete review.");
    }
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByProductId.pending, (state, action) => {
        const productId = action.meta.arg.productId;
        state.loadingByProductId[productId] = true;
        state.errorByProductId[productId] = null;
      })
      .addCase(fetchReviewsByProductId.fulfilled, (state, action: PayloadAction<{ productId: string; reviews: Review[]; pagination?: any }>) => {
        state.loadingByProductId[action.payload.productId] = false;
        state.byProductId[action.payload.productId] = action.payload.reviews;
        state.paginationByProductId[action.payload.productId] = action.payload.pagination;
      })
      .addCase(fetchReviewsByProductId.rejected, (state, action) => {
        const productId = action.meta.arg.productId;
        state.loadingByProductId[productId] = false;
        state.errorByProductId[productId] = action.payload as string;
      })
      .addCase(submitReview.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(submitReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.mutationLoading = false;
        const productId = String(action.payload.product || "");
        if (productId && state.byProductId[productId]) {
          state.byProductId[productId] = [action.payload, ...state.byProductId[productId]];
        }
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload as string;
      })
      .addCase(editReview.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(editReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.mutationLoading = false;
        for (const productId of Object.keys(state.byProductId)) {
          state.byProductId[productId] = state.byProductId[productId].map((review) =>
            (review._id || review.id) === (action.payload._id || action.payload.id) ? action.payload : review
          );
        }
      })
      .addCase(editReview.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload as string;
      })
      .addCase(removeReview.pending, (state) => {
        state.mutationLoading = true;
        state.mutationError = null;
      })
      .addCase(removeReview.fulfilled, (state, action) => {
        state.mutationLoading = false;
        for (const productId of Object.keys(state.byProductId)) {
          state.byProductId[productId] = state.byProductId[productId].filter(
            (review) => (review._id || review.id) !== action.payload
          );
        }
      })
      .addCase(removeReview.rejected, (state, action) => {
        state.mutationLoading = false;
        state.mutationError = action.payload as string;
      });
  },
});

export const { clearReviewError } = reviewsSlice.actions;

export default reviewsSlice.reducer;
