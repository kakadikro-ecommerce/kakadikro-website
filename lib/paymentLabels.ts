import type { PaymentMethod, PaymentStatus } from "@/types/order";

export const isOnlinePaymentMethod = (
  method?: PaymentMethod | string | null
): boolean => {
  const normalized = String(method || "").toLowerCase();
  return normalized === "card" || normalized === "upi";
};

export const formatPaymentMethodLabel = (
  method?: PaymentMethod | string | null
): string => {
  if (isOnlinePaymentMethod(method)) {
    return "Online Payment";
  }

  const normalized = String(method || "").toLowerCase();
  if (normalized === "cod") {
    return "Cash on delivery";
  }

  return "Cash on delivery";
};

export const formatPaymentStatusLabel = (
  status?: PaymentStatus | string | null
): string => {
  const normalized = String(status || "pending").toLowerCase();
  switch (normalized) {
    case "paid":
      return "Paid";
    case "failed":
      return "Failed";
    case "refunded":
      return "Refunded";
    default:
      return "Pending";
  }
};

export const needsOnlineCheckout = (order?: {
  paymentMethod?: PaymentMethod | string | null;
  paymentStatus?: PaymentStatus | string | null;
  orderStatus?: string | null;
} | null): boolean => {
  if (!order) return false;

  return (
    isOnlinePaymentMethod(order.paymentMethod) &&
    order.paymentStatus !== "paid" &&
    order.paymentStatus !== "refunded" &&
    order.orderStatus !== "cancelled"
  );
};
