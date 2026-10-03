"use client";

import { useEffect, useState, type InputHTMLAttributes } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  BadgeCheck,
  CreditCard,
  House,
  Mailbox,
  MapPinned,
  MapPlus,
  Map,
  NotebookText,
  Phone,
  ShoppingBag,
  UserRound,
  XCircle,
  Pencil
} from "lucide-react";

import { showAlert } from "@/components/ui/alert";
import CatalogImage from "@/components/ui/CatalogImage";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { getApiErrorMessage } from "@/lib/apiError";
import {
  formatPaymentMethodLabel,
  isOnlinePaymentMethod,
  needsOnlineCheckout,
} from "@/lib/paymentLabels";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { shippingAddressSchema, type ShippingAddressInput } from "@/lib/validations/order";
import { getVariantKey } from "@/lib/variantLabel";
import { createPaymentOrder, verifyPayment } from "@/redux/api/paymentApi";
import { getOrderDisplayId } from "@/redux/api/orderApi";
import { fetchCart, hydrateCartState } from "@/redux/slice/cartSlice";
import {
  cancelExistingOrder,
  clearOrderError,
  createNewOrder,
  fetchMyOrders,
  fetchOrderById,
  hydrateCurrentOrder,
  resetCurrentOrder,
  updateExistingOrder,
} from "@/redux/slice/orderSlice";
import {
  EMPTY_SHIPPING_ADDRESS,
  canCancelOrder,
  type Order,
  type PaymentMethod,
  type ShippingAddress,
} from "@/types/order";
import type { AuthUser } from "@/types/user";

const currency = (value: number) => `Rs. ${value.toFixed(2)}`;

type CheckoutPaymentChoice = Extract<PaymentMethod, "cod" | "card">;

const fieldConfig: Array<{
  name: keyof ShippingAddressInput;
  label: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
    {
      name: "fullName",
      label: "Full name",
      placeholder: "Enter recipient name",
      icon: UserRound,
    },
    {
      name: "phone",
      label: "Phone number",
      placeholder: "10-digit mobile number",
      icon: Phone,
    },
    {
      name: "addressLine1",
      label: "Address line 1",
      placeholder: "House no, street, area",
      icon: House,
    },
    {
      name: "addressLine2",
      label: "Address line 2",
      placeholder: "Apartment, landmark (optional)",
      icon: MapPlus,
    },
    {
      name: "city",
      label: "City",
      placeholder: "City",
      icon: MapPinned,
    },
    {
      name: "state",
      label: "State",
      placeholder: "State",
      icon: Map,
    },
    {
      name: "postalCode",
      label: "Postal code",
      placeholder: "6-digit PIN code",
      icon: Mailbox,
    },
    {
      name: "country",
      label: "Country",
      placeholder: "Country",
      icon: MapPinned,
    },
  ];

function AddressField({
  label,
  placeholder,
  error,
  icon: Icon,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <label className="group block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
      <div
        className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition ${error
          ? "border-red-300 shadow-red-100"
          : "border-orange-100 focus-within:border-orange-300 focus-within:shadow-orange-100"
          }`}
      >
        <Icon
          className={`h-4 w-4 shrink-0 ${error ? "text-red-400" : "text-orange-500"
            }`}
        />
        <input
          {...props}
          placeholder={placeholder}
          readOnly={props.readOnly}
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
      </div>
      {error ? <p className="mt-1 text-xs font-medium text-red-500">{error}</p> : null}
    </label>
  );
}

const getDefaultValues = (
  shippingAddress?: Partial<ShippingAddress> | null,
  user?: Pick<AuthUser, "name"> | null
): ShippingAddressInput => ({
  ...EMPTY_SHIPPING_ADDRESS,
  ...shippingAddress,
  fullName: shippingAddress?.fullName || user?.name || "",
});

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const retryOrderId = (searchParams.get("orderId") || "").trim();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentChoice>("card");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const cart = useAppSelector((state) => state.cart);
  const orderState = useAppSelector((state) => state.order);
  const order = orderState.currentOrder;
  const canEditAddress = !!order && canCancelOrder(order.orderStatus);
  const orderDisplayId = getOrderDisplayId(order);
  // Pay-now only when intentionally viewing an unpaid order (retry / post-place),
  // never when the live cart still has items for a new checkout.
  const showPayNow =
    needsOnlineCheckout(order) && (Boolean(retryOrderId) || cart.totalItems === 0);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
    mode: "onTouched",
    defaultValues: getDefaultValues(order?.shippingAddress),
  });

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login?redirect=%2Fcheckout");
      return;
    }

    let cancelled = false;

    const bootstrapCheckout = async () => {
      try {
        const cartSummary = await dispatch(fetchCart()).unwrap();

        if (cancelled) return;

        if (retryOrderId) {
          try {
            const targetOrder = await dispatch(
              fetchOrderById(retryOrderId)
            ).unwrap();

            if (cancelled) return;

            if (!needsOnlineCheckout(targetOrder)) {
              dispatch(resetCurrentOrder());
              showAlert({
                type: "info",
                message:
                  "This order does not need online payment. Opening your cart checkout instead.",
              });
              router.replace("/checkout");
              return;
            }

            dispatch(hydrateCurrentOrder(targetOrder));
            return;
          } catch (error: unknown) {
            if (cancelled) return;
            showAlert({
              type: "error",
              message: getApiErrorMessage(
                error,
                "Unable to load that order for checkout."
              ),
            });
            dispatch(resetCurrentOrder());
            router.replace("/checkout");
            return;
          }
        }

        // Fresh cart checkout — never hydrate a previous unpaid order over live cart items.
        if (cartSummary.totalItems > 0) {
          dispatch(resetCurrentOrder());
        }

        // A pending online payment does not block a new purchase.
        // Only restore the pay screen when the cart is empty.
        if (cartSummary.totalItems === 0) {
          try {
            const result = await dispatch(fetchMyOrders()).unwrap();
            if (cancelled) return;

            const unpaidOrder =
              result.orders.find((entry) => needsOnlineCheckout(entry)) || null;

            if (unpaidOrder) {
              dispatch(hydrateCurrentOrder(unpaidOrder));
            }
          } catch {
            // Order lookup is optional here; checkout stays usable.
          }
        }
      } catch {
        // Cart fetch errors surface via cart slice; keep checkout usable.
      }
    };

    void bootstrapCheckout();

    return () => {
      cancelled = true;
    };
  }, [currentUser, dispatch, retryOrderId, router]);

  useEffect(() => {
    reset(getDefaultValues(order?.shippingAddress, currentUser));
  }, [order?.shippingAddress, currentUser, reset]);

  useEffect(() => {
    if (!canEditAddress && isEditingAddress) {
      setIsEditingAddress(false);
    }
  }, [canEditAddress, isEditingAddress]);

  useEffect(() => {
    return () => {
      dispatch(clearOrderError());
    };
  }, [dispatch]);

  const clearLocalCart = () => {
    dispatch(
      hydrateCartState({
        items: [],
        subtotal: 0,
        totalItems: 0,
      })
    );
  };

  const runOnlinePayment = async (targetOrder: Order) => {
    if (!targetOrder.id) {
      throw new Error("Order id is missing. Please refresh and try again.");
    }

    const expectedAmount = Number(targetOrder.totalAmount);
    const paymentSession = await createPaymentOrder({
      orderId: targetOrder.id,
    });

    const razorpayAmount = Number(paymentSession.razorpay.amount);
    if (
      !Number.isFinite(razorpayAmount) ||
      razorpayAmount <= 0 ||
      Math.round(expectedAmount * 100) !== razorpayAmount
    ) {
      throw new Error(
        "Payment amount did not match this order. Please refresh and try again."
      );
    }

    const checkoutResponse = await openRazorpayCheckout({
      key: paymentSession.razorpay.key,
      amount: razorpayAmount,
      currency: paymentSession.razorpay.currency,
      name: "Kaka Dikro",
      description: `Payment for order ${getOrderDisplayId(targetOrder)}`,
      order_id: paymentSession.razorpay.orderId,
      prefill: {
        name:
          targetOrder.shippingAddress.fullName || currentUser?.name || undefined,
        email: currentUser?.email || undefined,
        contact: targetOrder.shippingAddress.phone || undefined,
      },
      notes: {
        orderId: targetOrder.id,
      },
      theme: {
        color: "#7A330F",
      },
    });

    const verified = await verifyPayment({
      razorpayOrderId: checkoutResponse.razorpay_order_id,
      razorpayPaymentId: checkoutResponse.razorpay_payment_id,
      razorpaySignature: checkoutResponse.razorpay_signature,
    });

    dispatch(hydrateCurrentOrder(verified.order));
    clearLocalCart();
    void dispatch(fetchCart());

    showAlert({
      type: "success",
      message: `Payment successful for order ${getOrderDisplayId(verified.order)}.`,
    });

    router.replace("/checkout");
  };

  const handlePlaceOrder = async (values: ShippingAddressInput) => {
    if (!cart.items.length) {
      showAlert({
        type: "info",
        message: "Your cart is empty. Add a few items before checkout.",
      });
      return;
    }

    try {
      const createdOrder = await dispatch(
        createNewOrder({
          shippingAddress: values,
          paymentMethod,
        })
      ).unwrap();

      // Order already snapshots cart items — clear local cart for both COD and online.
      clearLocalCart();
      void dispatch(fetchCart());

      const displayId = getOrderDisplayId(createdOrder);

      if (!displayId) {
        showAlert({
          type: "error",
          message:
            "Order was created but its id could not be confirmed. Please check Track Order.",
        });
        return;
      }

      if (paymentMethod === "cod") {
        showAlert({
          type: "success",
          message: `Order ${displayId} placed successfully.`,
        });
        return;
      }

      setPaymentLoading(true);
      try {
        await runOnlinePayment(createdOrder);
      } catch (paymentError: unknown) {
        showAlert({
          type: "error",
          message: getApiErrorMessage(
            paymentError,
            "Payment was not completed. Your order is saved — tap Pay now to retry.",
          ),
        });
      } finally {
        setPaymentLoading(false);
      }
    } catch (error: unknown) {
      showAlert({
        type: "error",
        message: getApiErrorMessage(
          error,
          "We could not place your order. Please try again.",
        ),
      });
    }
  };

  const handleRetryPayment = async () => {
    if (!order || !needsOnlineCheckout(order)) {
      return;
    }

    setPaymentLoading(true);
    try {
      await runOnlinePayment(order);
    } catch (error: unknown) {
      showAlert({
        type: "error",
        message: getApiErrorMessage(
          error,
          "Payment was not completed. Please try again.",
        ),
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order?.id || !canCancelOrder(order.orderStatus)) {
      return;
    }

    try {
      const cancelledOrder = await dispatch(
        cancelExistingOrder(order.id)
      ).unwrap();

      showAlert({
        type: "success",
        message: `Order ${getOrderDisplayId(cancelledOrder) || orderDisplayId} has been cancelled.`,
      });

      dispatch(resetCurrentOrder());
      void dispatch(fetchCart());
      if (retryOrderId) {
        router.replace("/checkout");
      }
    } catch (error: unknown) {
      showAlert({
        type: "error",
        message: getApiErrorMessage(
          error,
          "Unable to cancel this order right now.",
        ),
      });
    }
  };

  const handleStartAddressEdit = () => {
    if (!order?.shippingAddress || !canEditAddress) {
      return;
    }

    reset(getDefaultValues(order.shippingAddress));
    setIsEditingAddress(true);
  };

  const handleCancelAddressEdit = () => {
    reset(getDefaultValues(order?.shippingAddress));
    setIsEditingAddress(false);
  };

  const handleUpdateAddress = async (values: ShippingAddressInput) => {
    if (!order?.id || !canEditAddress) {
      return;
    }

    try {
      await dispatch(
        updateExistingOrder({
          id: order.id,
          payload: { shippingAddress: values },
        })
      ).unwrap();

      showAlert({
        type: "success",
        message: "Address updated successfully.",
      });

      setIsEditingAddress(false);
    } catch (error: unknown) {
      showAlert({
        type: "error",
        message: getApiErrorMessage(error, "Failed to update address."),
      });
    }
  };

  const hasCartItems = cart.totalItems > 0;
  const canShowCheckoutForm = hasCartItems && !showPayNow;
  const summaryItems = showPayNow && order
    ? order.items.map((item) => ({
        key: `${item.productId}-${item.weight}`,
        name: item.name,
        image: item.image,
        meta: item.weight || "",
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.price * item.quantity,
      }))
    : cart.items.map((item) => ({
        key: item.cartItemId,
        name: item.name,
        image: item.image,
        meta: `${item.category || "Product"}${
          getVariantKey(item.variant) ? ` - ${getVariantKey(item.variant)}` : ""
        }`,
        quantity: item.quantity,
        unitPrice: item.variant.price,
        lineTotal: item.variant.price * item.quantity,
      }));
  const summaryItemCount = showPayNow && order
    ? order.items.reduce((sum, item) => sum + item.quantity, 0)
    : cart.totalItems;
  const summaryTotal =
    showPayNow && order ? Number(order.totalAmount || 0) : cart.subtotal;
  const summaryTitle = showPayNow ? "Order summary" : "Cart summary";
  const summarySubtitle = showPayNow
    ? "Items locked on this unpaid order — Online Payment charges this total"
    : hasCartItems
      ? "Everything you are about to order"
      : "Your cart is currently empty";

  return (
    <section className="bg-[linear-gradient(180deg,_#fff7ed_0%,_#ffffff_28%,_#f8fafc_100%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="rounded-[32px] border border-orange-100 bg-white/95 p-6 shadow-[0_20px_60px_-28px_rgba(122,51,15,0.35)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-700">
                Checkout
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Review your cart and confirm delivery
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Complete your shipping details, choose how you want to pay, and confirm your order.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-orange-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                  Items
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">{summaryItemCount}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {showPayNow ? "Order total" : "Subtotal"}
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {currency(summaryTotal)}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Payment
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {showPayNow && order
                    ? "Awaiting pay"
                    : order && !showPayNow
                      ? isOnlinePaymentMethod(order.paymentMethod)
                        ? "Online Payment"
                        : "COD"
                      : paymentMethod === "card"
                        ? "Online Payment"
                        : "COD"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="rounded-[30px] border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100">
                  <ShoppingBag className="h-5 w-5 text-orange-700" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{summaryTitle}</h2>
                  <p className="text-sm text-slate-500">{summarySubtitle}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {summaryItems.length > 0 ? (
                  summaryItems.map((item) => (
                    <article
                      key={item.key}
                      className="flex gap-4 rounded-[24px] border border-slate-100 bg-slate-50/80 p-4"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white">
                        <CatalogImage
                          src={item.image}
                          fallback="/assets/kde-logo.png"
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                          onExpired={() => {
                            void dispatch(fetchCart());
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="line-clamp-2 text-base font-semibold text-slate-900">
                              {item.name}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">{item.meta}</p>
                          </div>
                          <p className="text-sm font-semibold text-slate-900">
                            x{item.quantity}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm">
                          <span className="text-slate-500">
                            {currency(item.unitPrice)} each
                          </span>
                          <span className="font-semibold text-slate-900">
                            {currency(item.lineTotal)}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-orange-200 bg-orange-50/50 px-5 py-8 text-center">
                    <p className="text-lg font-semibold text-slate-900">No items ready for checkout</p>
                    <p className="mt-2 text-sm text-slate-500">
                      Add products to your cart before placing an order.
                    </p>
                    <Link
                      href="/products"
                      className="mt-5 inline-flex rounded-full bg-[#7A330F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f2609]"
                    >
                      Explore products
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Items</span>
                    <span>{summaryItemCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>{currency(summaryTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>Included / calculated on order</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                    <span>Total payable</span>
                    <span>{currency(summaryTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {order && showPayNow ? (
              <div className="rounded-[30px] border border-emerald-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
                    <BadgeCheck className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {order.paymentStatus === "paid"
                        ? "Order confirmed"
                        : "Awaiting payment"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {order.paymentStatus === "paid"
                        ? "Payment received. Your order is being prepared."
                        : "Your order is saved in Track Order. Complete Online Payment to confirm it."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Order ID
                    </p>
                    <p className="mt-2 break-all text-sm font-semibold text-slate-900 md:text-base">
                      {orderDisplayId || "Unavailable"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Status
                    </p>
                    <p className="mt-2 text-sm font-semibold capitalize text-slate-900 md:text-base">
                      {order.orderStatus}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CreditCard className="h-4 w-4 text-orange-600" />
                    Payment details
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Payment method:{" "}
                    <span className="font-semibold">
                      {formatPaymentMethodLabel(order.paymentMethod)}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Payment status:{" "}
                    <span className="font-semibold capitalize">
                      {order.paymentStatus}
                    </span>
                  </p>

                  {showPayNow ? (
                    <button
                      type="button"
                      onClick={() => void handleRetryPayment()}
                      disabled={paymentLoading || orderState.actionLoading}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#7A330F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5f2609] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {paymentLoading
                        ? "Opening payment..."
                        : `Pay ${currency(Number(order.totalAmount || 0))} online`}
                    </button>
                  ) : null}
                </div>

                <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <MapPinned className="h-4 w-4 text-orange-600" />
                      Shipping address
                    </div>

                    {canEditAddress && !isEditingAddress ? (
                      <button
                        type="button"
                        onClick={handleStartAddressEdit}
                        disabled={orderState.actionLoading}
                        className="inline-flex items-center gap-2 self-start rounded-full border border-orange-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Edit shipping address"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                    ) : null}
                  </div>

                  {isEditingAddress ? (
                    <form
                      onSubmit={handleSubmit(handleUpdateAddress)}
                      className="mt-4 space-y-5"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        {fieldConfig.map((field) => {
                          const isNameField = field.name === "fullName";
                          return (
                            <Controller
                              key={field.name}
                              control={control}
                              name={field.name}
                              render={({ field: controllerField }) => (
                                <AddressField
                                  {...controllerField}
                                  value={controllerField.value ?? ""}
                                  label={field.label}
                                  placeholder={field.placeholder}
                                  icon={field.icon}
                                  error={errors[field.name]?.message}
                                  readOnly={isNameField}
                                  className={`w-full ${isNameField ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""}`}
                                />
                              )}
                            />
                          );
                        })}
                      </div>

                      {orderState.error ? (
                        <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                          {orderState.error}
                        </p>
                      ) : null}

                      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={handleCancelAddressEdit}
                          disabled={orderState.actionLoading}
                          className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={orderState.actionLoading}
                          className="inline-flex w-full items-center justify-center rounded-full bg-[#7A330F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5f2609] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                          {orderState.actionLoading ? "Updating..." : "Update address"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {order.shippingAddress.fullName}
                      <br />
                      {order.shippingAddress.addressLine1}
                      {order.shippingAddress.addressLine2
                        ? `, ${order.shippingAddress.addressLine2}`
                        : ""}
                      <br />
                      {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                      <br />
                      {order.shippingAddress.country}
                      <br />
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </div>

                {canCancelOrder(order.orderStatus) ? (
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    disabled={orderState.actionLoading}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel order
                  </button>
                ) : (
                  <p className="mt-6 text-sm text-slate-500">
                    This order can no longer be cancelled because its status is{" "}
                    <span className="font-semibold capitalize">{order.orderStatus}</span>.
                  </p>
                )}
              </div>
            ) : order && !showPayNow ? (
              <div className="rounded-[30px] border border-emerald-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
                    <BadgeCheck className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {order.paymentStatus === "paid"
                        ? "Order confirmed"
                        : "Order placed"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {order.paymentStatus === "paid"
                        ? "Payment received. Your order is being prepared."
                        : "Your order has been created and is now being prepared."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Order ID
                    </p>
                    <p className="mt-2 break-all text-sm font-semibold text-slate-900 md:text-base">
                      {orderDisplayId || "Unavailable"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Status
                    </p>
                    <p className="mt-2 text-sm font-semibold capitalize text-slate-900 md:text-base">
                      {order.orderStatus}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/trackOrder"
                    className="inline-flex rounded-full bg-[#7A330F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5f2609]"
                  >
                    Track order
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          <div>
            {canShowCheckoutForm ? (
              <div className="rounded-[30px] border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100">
                    <NotebookText className="h-5 w-5 text-orange-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Shipping address
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Fill in the delivery details exactly as they should appear on the parcel.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit(handlePlaceOrder)}
                  className="mt-6 space-y-5"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {fieldConfig.map((field) => (
                      <Controller
                        key={field.name}
                        control={control}
                        name={field.name}
                        render={({ field: controllerField }) => (
                          <AddressField
                            {...controllerField}
                            value={controllerField.value ?? ""}
                            label={field.label}
                            placeholder={field.placeholder}
                            icon={field.icon}
                            error={errors[field.name]?.message}
                            readOnly={field.name === "fullName"}
                            className={`w-full ${field.name === "fullName" ? "cursor-not-allowed bg-slate-100 text-slate-500" : ""}`}
                          />
                        )}
                      />
                    ))}
                  </div>

                  {orderState.error ? (
                    <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {orderState.error}
                    </p>
                  ) : null}

                  <div className="space-y-3 rounded-[24px] border border-orange-100 bg-orange-50/60 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700">
                      Payment method
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          paymentMethod === "card"
                            ? "border-[#7A330F] bg-white shadow-sm"
                            : "border-transparent bg-white/70 hover:border-orange-200"
                        }`}
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          Online Payment
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          UPI, card, netbanking
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          paymentMethod === "cod"
                            ? "border-[#7A330F] bg-white shadow-sm"
                            : "border-transparent bg-white/70 hover:border-orange-200"
                        }`}
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          Cash on delivery
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Pay when your order arrives
                        </p>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={orderState.actionLoading || paymentLoading}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#7A330F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5f2609] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {orderState.actionLoading
                      ? "Placing order..."
                      : paymentLoading
                        ? "Opening payment..."
                        : paymentMethod === "card"
                          ? "Place order & pay"
                          : "Place order"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="rounded-[30px] border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  {showPayNow && order
                    ? "Complete payment"
                    : order
                      ? "Order details ready"
                      : "Checkout unavailable"}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {showPayNow && order
                    ? "Use Online Payment below to finish this order, or cancel it if you no longer need it."
                    : order
                      ? "Your latest order summary is shown here. You can track its status or cancel it while it is still pending or confirmed."
                      : "Once your cart has items, the shipping form will appear here so you can complete checkout."}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/products"
                    className="inline-flex rounded-full bg-[#7A330F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5f2609]"
                  >
                    Continue shopping
                  </Link>
                  {order ? (
                    <Link
                      href="/trackOrder"
                      className="inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Track order
                    </Link>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
