"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Clock,
  MapPin,
  PackageCheck,
  PackageSearch,
  Search,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  cancelExistingOrder,
  fetchMyOrders,
  fetchOrderById,
  hydrateOrderCache,
} from "@/redux/slice/orderSlice";
import { canCancelOrder, type Order, type OrderStatus } from "@/types/order";

const STATUS_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "dispatched",
  "delivered",
];

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  confirmed: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  dispatched: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const ORDER_HISTORY_STORAGE_KEY = "track-order-history-cache";

type CachedOrderHistory = {
  orders: Order[];
  currentOrder: Order | null;
  selectedOrder: Order | null;
  showMyOrders: boolean;
};

const getCachedOrderHistory = (): CachedOrderHistory | null => {
  if (typeof window === "undefined") return null;

  const cachedValue = window.localStorage.getItem(ORDER_HISTORY_STORAGE_KEY);
  if (!cachedValue) return null;

  try {
    const parsed = JSON.parse(cachedValue) as {
      orders?: Order[];
      currentOrder?: Order | null;
      selectedOrder?: Order | null;
      showMyOrders?: boolean;
    };

    return {
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      currentOrder: parsed.currentOrder ?? null,
      selectedOrder: parsed.selectedOrder ?? parsed.currentOrder ?? null,
      showMyOrders: Boolean(parsed.showMyOrders),
    };
  } catch {
    window.localStorage.removeItem(ORDER_HISTORY_STORAGE_KEY);
    return null;
  }
};

const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString("en-IN")}`;

const formatDate = (value?: string) => {
  if (!value) return "N/A";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusCopy = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "Your order has been placed and is waiting for confirmation.";
    case "confirmed":
      return "Your order is confirmed and will be prepared for dispatch soon.";
    case "dispatched":
      return "Your package is on the way. Use the courier and tracking ID below to follow it.";
    case "delivered":
      return "This order has been delivered successfully.";
    case "cancelled":
      return "This order was cancelled and will not be shipped.";
    default:
      return "We are updating your order status.";
  }
};

const TrackOrder = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, actionLoading, error } = useAppSelector(
    (state) => state.order
  );
  const cachedOrderHistory = useMemo(() => getCachedOrderHistory(), []);

  const [input, setInput] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    () => cachedOrderHistory?.selectedOrder ?? null
  );
  const [showMyOrders, setShowMyOrders] = useState(
    () => cachedOrderHistory?.showMyOrders ?? false
  );
  const [detailsLoadingId, setDetailsLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!cachedOrderHistory) return;

    dispatch(
      hydrateOrderCache({
        orders: cachedOrderHistory.orders,
        currentOrder: cachedOrderHistory.currentOrder,
      })
    );
  }, [cachedOrderHistory, dispatch]);

  const handleSearch = () => {
    if (!input.trim()) return;

    dispatch(fetchOrderById(input.trim()))
      .unwrap()
      .then((res) => {
        setSelectedOrder(res);
        setShowMyOrders(false);
        setInput("");
      })
      .catch(() => {
        setSelectedOrder(null);
      });
  };

  const handleViewMyOrders = () => {
    setShowMyOrders(true);
    dispatch(fetchMyOrders())
      .unwrap()
      .then((res) => {
        if (!selectedOrder && res.orders.length > 0) {
          setSelectedOrder(res.orders[0]);
        }
      })
      .catch(() => undefined);
  };

  const handleSelectOrder = (orderNumber: string, orderId: string) => {
    setDetailsLoadingId(orderId);

    dispatch(fetchOrderById(orderNumber))
      .unwrap()
      .then((res) => {
        setSelectedOrder(res);
      })
      .finally(() => {
        setDetailsLoadingId(null);
      });
  };

  const selectedOrderId = selectedOrder?.id;
  const activeOrder = useMemo(() => {
    if (!selectedOrderId) return selectedOrder;
    return orders.find((entry) => entry.id === selectedOrderId) || selectedOrder;
  }, [orders, selectedOrder, selectedOrderId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      ORDER_HISTORY_STORAGE_KEY,
      JSON.stringify({
        orders,
        currentOrder: activeOrder,
        selectedOrder,
        showMyOrders,
      })
    );
  }, [orders, activeOrder, selectedOrder, showMyOrders]);

  const currentStepIndex =
    activeOrder && activeOrder.orderStatus !== "cancelled"
      ? STATUS_STEPS.indexOf(activeOrder.orderStatus)
      : -1;

  return (
    <section className="w-full py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-center text-2xl font-bold text-[#003d4d] sm:text-3xl">
            Track Your Order
          </h1>

          <div className="space-y-4 rounded-2xl border border-[#d8ebe5] bg-white p-4 shadow-[0_16px_50px_rgba(0,61,77,0.08)] sm:p-6">
            <div className="flex justify-center gap-4 text-sm">
              <span className="font-medium">Search by:</span>

              <label className="flex cursor-pointer items-center gap-1">
                <input type="radio" checked readOnly />
                Order Number
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                type="text"
                placeholder="Enter Order Number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full sm:flex-1 md:flex-none md:w-[55%] rounded-xl border border-[#c7ddda] px-4 py-3 text-sm text-[#16343c] outline-none transition focus:border-[#003d4d] focus:ring-2 focus:ring-[#003d4d]/15"
              />

              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex items-center text-sm justify-center gap-2 rounded-xl bg-[#003d4d] px-4 text-white transition hover:rounded-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search size={14} />
                {loading && !showMyOrders ? "Tracking..." : "Track"}
              </button>

              <button
                onClick={handleViewMyOrders}
                className="flex items-center text-sm justify-center rounded-xl bg-[#612709] px-2 text-white transition hover:rounded-full"
              >
                Order History
              </button>
            </div>

            <p className="flex items-center justify-center text-xs text-gray-500">
              Check the latest shipment status for your recent or past orders.
            </p>
          </div>
        </div>

        {error && (
          <div className="mx-auto mt-6 flex max-w-4xl items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {(showMyOrders || activeOrder) && (
          <div className="mt-10 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
            <aside className="rounded-3xl border border-[#d9ebe6] bg-white p-4 shadow-[0_18px_60px_rgba(0,61,77,0.08)] sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-[#003d4d]">
                    My Orders
                  </h2>
                  <p className="text-sm text-gray-500">
                    Open any order to see full details.
                  </p>
                </div>
                <div className="rounded-full bg-[#eef7f4] px-3 py-1 text-xs font-medium text-[#0d5d6c]">
                  {orders.length} orders
                </div>
              </div>

              {loading && showMyOrders && orders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#c7ddda] px-4 py-8 text-center text-sm text-gray-500">
                  Loading your orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#c7ddda] px-4 py-8 text-center">
                  <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-[#7aa2a9]" />
                  <p className="text-sm font-medium text-[#003d4d]">
                    No orders found yet
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Your recent and previous orders will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => {
                    const isActive = activeOrder?.id === ord.id;
                    const isLoadingCard = detailsLoadingId === ord.id;

                    return (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => handleSelectOrder(ord.orderNumber, ord.id)}
                        className={`w-full rounded-2xl border p-4 text-left transition ${isActive
                          ? "border-[#0d5d6c] bg-[#f2fbf8] shadow-sm"
                          : "border-[#d9ebe6] bg-white hover:border-[#98c8bd] hover:bg-[#fbfefd]"
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-semibold text-[#003d4d]">
                              {ord.orderNumber}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[ord.orderStatus]}`}
                          >
                            {ord.orderStatus}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                              Ordered
                            </p>
                            <p className="mt-1 font-medium text-[#26444b]">
                              {formatDate(ord.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                              Amount
                            </p>
                            <p className="mt-1 font-medium text-[#26444b]">
                              {formatCurrency(ord.totalAmount)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 text-xs font-medium text-[#0d5d6c]">
                          {isLoadingCard ? "Opening details..." : "View full details"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </aside>

            <div className="rounded-3xl border border-[#d9ebe6] bg-white p-5 shadow-[0_18px_60px_rgba(0,61,77,0.08)] sm:p-6">
              {!activeOrder ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#c7ddda] bg-[#fbfefd] px-6 py-10 text-center">
                  <PackageSearch className="mb-4 h-10 w-10 text-[#7aa2a9]" />
                  <h3 className="text-lg font-semibold text-[#003d4d]">
                    Select an order to view details
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-gray-500">
                    Track a fresh order above or open any order from the left panel
                    to check items, status, shipping details, and actions.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 rounded-2xl bg-[linear-gradient(135deg,#003d4d_0%,#0f6a6f_100%)] p-5 text-white sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-white/70">Order summary</p>
                      <h2 className="text-2xl font-semibold">
                        {activeOrder.orderNumber}
                      </h2>
                      <p className="max-w-2xl text-sm text-white/80">
                        {getStatusCopy(activeOrder.orderStatus)}
                      </p>
                    </div>

                    <div
                      className={`inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-semibold capitalize ${statusStyles[activeOrder.orderStatus]
                        }`}
                    >
                      {activeOrder.orderStatus}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-[#d9ebe6] bg-[#fbfefd] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                        Ordered on
                      </p>
                      <p className="mt-2 text-base font-semibold text-[#003d4d]">
                        {formatDate(activeOrder.createdAt)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#d9ebe6] bg-[#fbfefd] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                        Payment
                      </p>
                      <p className="mt-2 text-base font-semibold capitalize text-[#003d4d]">
                        {activeOrder.paymentMethod} / {activeOrder.paymentStatus}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#d9ebe6] bg-[#fbfefd] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                        Total amount
                      </p>
                      <p className="mt-2 text-base font-semibold text-[#003d4d]">
                        {formatCurrency(activeOrder.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#d9ebe6] p-4 sm:p-5">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-[#003d4d]">
                        Tracking progress
                      </h3>
                      {activeOrder.shipment?.trackingId && (
                        <span className="rounded-full bg-[#eef7f4] px-3 py-1 text-xs font-medium text-[#0d5d6c]">
                          Tracking ID: {activeOrder.shipment.trackingId}
                        </span>
                      )}
                    </div>

                    {activeOrder.orderStatus === "cancelled" ? (
                      <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                        <div>
                          <p className="font-semibold">Order cancelled</p>
                          <p className="mt-1 text-sm">
                            This order is no longer active. If you need help,
                            please contact support with your order number.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="grid gap-4 sm:grid-cols-4">
                          {STATUS_STEPS.map((step, index) => {
                            const isComplete = index <= currentStepIndex;
                            const isCurrent = activeOrder.orderStatus === step;

                            return (
                              <div
                                key={step}
                                className={`rounded-2xl border p-4 ${isComplete
                                  ? "border-emerald-200 bg-emerald-50"
                                  : "border-gray-200 bg-gray-50"
                                  }`}
                              >
                                <div className="mb-3 flex items-center justify-between">
                                  {isComplete ? (
                                    <PackageCheck className="h-5 w-5 text-emerald-600" />
                                  ) : (
                                    <Clock className="h-5 w-5 text-gray-400" />
                                  )}
                                  {isCurrent && (
                                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                                      Current
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`text-sm font-semibold capitalize ${isComplete ? "text-emerald-700" : "text-gray-500"
                                    }`}
                                >
                                  {step}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        {activeOrder.orderStatus === "dispatched" &&
                          activeOrder.shipment?.trackingId && (
                            <div className="mt-5 rounded-2xl border border-[#b8dbd0] bg-[#f2fbf8] p-4 sm:p-5">
                              <div className="flex items-start gap-3">
                                <Truck className="mt-0.5 h-5 w-5 text-[#0d5d6c]" />
                                <div className="space-y-2">
                                  <p className="font-semibold text-[#003d4d]">
                                    Shipment details
                                  </p>
                                  <p className="text-sm text-[#31545b]">
                                    Courier:{" "}
                                    <span className="font-medium">
                                      {activeOrder.shipment.courierName || "Courier partner"}
                                    </span>
                                  </p>
                                  <p className="text-sm text-[#31545b]">
                                    Tracking ID:{" "}
                                    <span className="font-medium">
                                      {activeOrder.shipment.trackingId}
                                    </span>
                                  </p>
                                  <p className="text-sm text-[#31545b]">
                                    Go to the{" "}
                                    {activeOrder.shipment.courierName || "courier"}{" "}
                                    website, enter this tracking ID, and track your
                                    order there for the latest movement updates.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                      </>
                    )}
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_340px]">
                    <div className="rounded-2xl border border-[#d9ebe6] p-4 sm:p-5">
                      <h3 className="text-lg font-semibold text-[#003d4d]">
                        Order items
                      </h3>
                      <div className="mt-4 space-y-3">
                        {activeOrder.items.map((item, index) => (
                          <div
                            key={`${item.productId}-${index}`}
                            className="flex flex-col gap-4 rounded-2xl border border-[#e4f0ed] p-4 sm:flex-row sm:items-center"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="h-20 w-20 rounded-2xl border border-[#e4f0ed] bg-[#f8fbfa] object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-[#003d4d]">
                                {item.name}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.weight || "Pack details unavailable"}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <p className="text-base font-semibold text-[#003d4d]">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-[#d9ebe6] p-4 sm:p-5">
                        <h3 className="text-lg font-semibold text-[#003d4d]">
                          Delivery address
                        </h3>
                        <div className="mt-4 flex items-start gap-3">
                          <MapPin className="mt-1 h-5 w-5 text-[#0d5d6c]" />
                          <div className="text-sm text-[#31545b]">
                            <p className="font-semibold text-[#003d4d]">
                              {activeOrder.shippingAddress.fullName}
                            </p>
                            <p>{activeOrder.shippingAddress.phone}</p>
                            <p className="mt-1">
                              {activeOrder.shippingAddress.addressLine1}
                              {activeOrder.shippingAddress.addressLine2
                                ? `, ${activeOrder.shippingAddress.addressLine2}`
                                : ""}
                              , {activeOrder.shippingAddress.city},{" "}
                              {activeOrder.shippingAddress.state} -{" "}
                              {activeOrder.shippingAddress.postalCode}
                            </p>
                            <p>{activeOrder.shippingAddress.country}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#d9ebe6] p-4 sm:p-5">
                        <h3 className="text-lg font-semibold text-[#003d4d]">
                          Notes
                        </h3>
                        <div className="mt-4 space-y-3 text-sm text-[#31545b]">
                          <p>
                            Customer note:{" "}
                            <span className="font-medium text-[#003d4d]">
                              {activeOrder.notes || "No note added"}
                            </span>
                          </p>
                          <p>
                            Admin note:{" "}
                            <span className="font-medium text-[#003d4d]">
                              {activeOrder.adminNote || "No update from admin yet"}
                            </span>
                          </p>
                        </div>
                      </div>

                      {canCancelOrder(activeOrder.orderStatus) && (
                        <button
                          onClick={() =>
                            dispatch(cancelExistingOrder(activeOrder.id))
                              .unwrap()
                              .then((res) => {
                                setSelectedOrder(res);
                              })
                          }
                          disabled={actionLoading}
                          className="w-full rounded-2xl bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionLoading ? "Cancelling order..." : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrackOrder;
