"use client";

import { useEffect, useState, type InputHTMLAttributes } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { shippingAddressSchema, type ShippingAddressInput } from "@/lib/validations/order";
import { fetchCart, hydrateCartState } from "@/redux/slice/cartSlice";
import {
  cancelExistingOrder,
  clearOrderError,
  createNewOrder,
  updateExistingOrder,
} from "@/redux/slice/orderSlice";
import {
  EMPTY_SHIPPING_ADDRESS,
  canCancelOrder,
  type ShippingAddress,
} from "@/types/order";
import type { AuthUser } from "@/types/user";

const currency = (value: number) => `Rs. ${value.toFixed(2)}`;

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
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const cart = useAppSelector((state) => state.cart);
  const orderState = useAppSelector((state) => state.order);
  const order = orderState.currentOrder;
  const canEditAddress = !!order && canCancelOrder(order.orderStatus);

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

    if (!cart.items.length) {
      void dispatch(fetchCart());
    }
  }, [cart.items.length, currentUser, dispatch, router]);

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
          paymentMethod: "cod",
        })
      ).unwrap();

      dispatch(
        hydrateCartState({
          items: [],
          subtotal: 0,
          totalItems: 0,
        })
      );

      showAlert({
        type: "success",
        message: `Order ${createdOrder.orderNumber} placed successfully.`,
      });
    } catch (message) {
      showAlert({
        type: "error",
        message:
          typeof message === "string"
            ? message
            : "We could not place your order. Please try again.",
      });
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
        message: `Order ${cancelledOrder.orderNumber} has been cancelled.`,
      });
    } catch (message) {
      showAlert({
        type: "error",
        message:
          typeof message === "string"
            ? message
            : "Unable to cancel this order right now.",
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
    } catch (message) {
      showAlert({
        type: "error",
        message:
          typeof message === "string"
            ? message
            : "Failed to update address.",
      });
    }
  };

  const hasCartItems = cart.totalItems > 0;
  const canShowCheckoutForm = hasCartItems && !order;

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
                Complete your shipping details, verify your order summary, and place your order with cash on delivery.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-orange-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                  Items
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">{cart.totalItems}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Subtotal
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {currency(cart.subtotal)}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Payment
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">COD</p>
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
                  <h2 className="text-xl font-semibold text-slate-900">Cart summary</h2>
                  <p className="text-sm text-slate-500">
                    {hasCartItems
                      ? "Everything you are about to order"
                      : "Your cart is currently empty"}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {hasCartItems ? (
                  cart.items.map((item) => (
                    <article
                      key={item.cartItemId}
                      className="flex gap-4 rounded-[24px] border border-slate-100 bg-slate-50/80 p-4"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white">
                        <Image
                          src={item.image || "/assets/kde-logo.png"}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="line-clamp-2 text-base font-semibold text-slate-900">
                              {item.name}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {item.category || "Premium spice"}
                              {item.variant.weight ? ` - ${item.variant.weight}` : ""}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-slate-900">
                            x{item.quantity}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm">
                          <span className="text-slate-500">
                            {currency(item.variant.price)} each
                          </span>
                          <span className="font-semibold text-slate-900">
                            {currency(item.variant.price * item.quantity)}
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
                    <span>{cart.totalItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>{currency(cart.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>Calculated later</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                    <span>Total payable</span>
                    <span>{currency(cart.subtotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {order ? (
              <div className="rounded-[30px] border border-emerald-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100">
                    <BadgeCheck className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Order placed</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Your order has been created and is now being prepared.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Order ID
                    </p>
                    <p className="mt-2 text-sm md:text-base font-semibold text-slate-900">
                      {order.orderNumber || order.id}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Status
                    </p>
                    <p className="mt-2 text-sm md:text-base font-semibold capitalize text-slate-900">
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
                    Payment method: <span className="font-semibold uppercase">{order.paymentMethod}</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Payment status: <span className="font-semibold capitalize">{order.paymentStatus}</span>
                  </p>
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

                  <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-slate-600">
                    Cash on delivery is currently enabled for checkout. You can review or cancel the order later while it remains pending or confirmed.
                  </div>

                  <button
                    type="submit"
                    disabled={orderState.actionLoading}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#7A330F] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5f2609] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {orderState.actionLoading ? "Placing order..." : "Place order"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="rounded-[30px] border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  {order ? "Order details ready" : "Checkout unavailable"}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {order
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


