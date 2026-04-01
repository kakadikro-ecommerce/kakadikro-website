import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import * as orderApi from "@/redux/api/orderApi";
import type { RootState } from "@/redux/store";
import type {
  CreateOrderPayload,
  Order,
  OrdersResponse,
  OrderState,
  ShippingAddress,
} from "@/types/order";

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  actionLoading: false,
  error: null,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ||
      error.message ||
      fallback
    );
  }

  return error instanceof Error ? error.message : fallback;
};

const upsertOrder = (orders: Order[], order: Order) => {
  const existingIndex = orders.findIndex((entry) => entry.id === order.id);

  if (existingIndex >= 0) {
    orders[existingIndex] = order;
    return;
  }

  orders.unshift(order);
};

export const createNewOrder = createAsyncThunk<
  Order,
  CreateOrderPayload,
  { rejectValue: string }
>("order/createNewOrder", async (payload, { rejectWithValue }) => {
  try {
    return await orderApi.createOrder(payload);
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to place your order.")
    );
  }
});

export const fetchMyOrders = createAsyncThunk<
  OrdersResponse,
  void,
  { rejectValue: string }
>("order/fetchMyOrders", async (_, { rejectWithValue }) => {
  try {
    return await orderApi.getMyOrders();
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to fetch your orders.")
    );
  }
});

export const fetchOrderById = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("order/fetchOrderById", async (orderNumber, { rejectWithValue }) => {
  try {
    return await orderApi.trackOrder(orderNumber);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch the order."));
  }
});

export const updateExistingOrder = createAsyncThunk<
  Order,
  { id: string; payload: { shippingAddress?: ShippingAddress; notes?: string } },
  { rejectValue: string }
>("order/updateExistingOrder", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await orderApi.updateOrder(id, payload);
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to update the order.")
    );
  }
});

export const cancelExistingOrder = createAsyncThunk<
  Order,
  string,
  { state: RootState; rejectValue: string }
>("order/cancelExistingOrder", async (orderId, { getState, rejectWithValue }) => {
  try {
    const cancelledOrder = await orderApi.cancelOrder(orderId);
    const state = getState();
    const existingOrder =
      state.order.currentOrder?.id === orderId
        ? state.order.currentOrder
        : state.order.orders.find((entry) => entry.id === orderId);

    const trackedOrderNumber =
      cancelledOrder.orderNumber || existingOrder?.orderNumber;

    if (trackedOrderNumber) {
      try {
        return await orderApi.trackOrder(trackedOrderNumber);
      } catch {
        return {
          ...existingOrder,
          ...cancelledOrder,
          items:
            cancelledOrder.items.length > 0
              ? cancelledOrder.items
              : existingOrder?.items || [],
        } as Order;
      }
    }

    return cancelledOrder;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to cancel the order.")
    );
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    hydrateOrderCache: (
      state,
      action: PayloadAction<{ orders: Order[]; currentOrder: Order | null }>
    ) => {
      state.orders = action.payload.orders;
      state.currentOrder = action.payload.currentOrder;
      state.error = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrderState: () => initialState,
    resetCurrentOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
      state.actionLoading = false;
    },
    hydrateCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
      if (action.payload) {
        upsertOrder(state.orders, action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.currentOrder = action.payload;
        upsertOrder(state.orders, action.payload);
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to place your order.";
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;

        if (state.currentOrder) {
          const refreshedCurrentOrder = action.payload.orders.find(
            (order) => order.id === state.currentOrder?.id
          );

          if (refreshedCurrentOrder) {
            state.currentOrder = refreshedCurrentOrder;
          }
        }
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch your orders.";
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        upsertOrder(state.orders, action.payload);
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch the order.";
      })
      .addCase(updateExistingOrder.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateExistingOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.currentOrder = action.payload;
        upsertOrder(state.orders, action.payload);
      })
      .addCase(updateExistingOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to update the order.";
      })
      .addCase(cancelExistingOrder.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(cancelExistingOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.currentOrder = action.payload;
        upsertOrder(state.orders, action.payload);
      })
      .addCase(cancelExistingOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to cancel the order.";
      });
  },
});

export const {
  hydrateOrderCache,
  clearOrderError,
  resetOrderState,
  resetCurrentOrder,
  hydrateCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
