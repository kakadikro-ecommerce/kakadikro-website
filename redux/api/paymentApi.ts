import axios from "@/lib/axios";
import { getAccessToken } from "@/lib/auth";
import { getCheckoutIdempotencyKey, getGuestOrderToken } from "@/lib/guestSession";
import { mapOrder, type RawOrder } from "@/redux/api/orderApi";
import type { Order } from "@/types/order";

export type CreatePaymentOrderPayload = {
  orderId: string;
};

export type VerifyPaymentPayload = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export type RazorpayCheckoutSession = {
  key: string;
  orderId: string;
  amount: number;
  currency: string;
};

export type MagicCheckoutSession = {
  order: Order;
  guestOrderToken?: string;
  razorpay: RazorpayCheckoutSession;
  checkout: {
    oneClickCheckout: boolean;
    script: string;
    name: string;
    showCoupons: boolean;
  };
};

export type PaymentOrderResult = {
  razorpay: RazorpayCheckoutSession;
  paymentId?: string;
  orderId?: string;
};

export type VerifyPaymentResult = {
  order: Order;
  paymentStatus?: string;
};

type RawMagicCheckoutResponse = {
  guestOrderToken?: string;
  data?: {
    guestOrderToken?: string;
    order?: RawOrder;
    razorpay?: {
      key?: string;
      orderId?: string;
      amount?: number;
      currency?: string;
    };
    checkout?: {
      oneClickCheckout?: boolean;
      script?: string;
      name?: string;
      showCoupons?: boolean;
    };
  };
};

type RawPaymentOrderResponse = {
  data?: {
    payment?: {
      _id?: string;
      id?: string;
      orderId?: string | { _id?: string; id?: string };
      status?: string;
    };
    razorpay?: {
      key?: string;
      orderId?: string;
      amount?: number;
      currency?: string;
    };
  };
};

type RawVerifyPaymentResponse = {
  data?: {
    payment?: {
      status?: string;
    };
    order?: RawOrder;
  };
};

export const startMagicCheckout = async (): Promise<MagicCheckoutSession> => {
  const response = await axios.post<RawMagicCheckoutResponse>(
    "/user/payments/magic-checkout",
    {},
    {
      headers: {
        "Idempotency-Key": getCheckoutIdempotencyKey(),
      },
    }
  );

  const data = response.data?.data;
  const razorpay = data?.razorpay;
  const order = data?.order;

  if (!razorpay?.key || !razorpay.orderId || !order) {
    throw new Error("Unable to start checkout. Please try again.");
  }

  const guestOrderToken =
    response.data?.guestOrderToken || data?.guestOrderToken || getGuestOrderToken();

  return {
    order: mapOrder(order),
    guestOrderToken: guestOrderToken || undefined,
    razorpay: {
      key: razorpay.key,
      orderId: razorpay.orderId,
      amount: Number(razorpay.amount),
      currency: razorpay.currency || "INR",
    },
    checkout: {
      oneClickCheckout: true,
      script: data?.checkout?.script || "https://checkout.razorpay.com/v1/magic-checkout.js",
      name: data?.checkout?.name || "Kaka Dikro",
      showCoupons: false,
    },
  };
};

export const createPaymentOrder = async (
  payload: CreatePaymentOrderPayload
): Promise<PaymentOrderResult> => {
  const response = await axios.post<RawPaymentOrderResponse>(
    "/user/payments/orders",
    payload
  );

  const razorpay = response.data?.data?.razorpay;
  const payment = response.data?.data?.payment;

  if (!razorpay?.key || !razorpay.orderId || razorpay.amount == null) {
    throw new Error("Unable to start payment. Please try again.");
  }

  const nestedOrderId =
    typeof payment?.orderId === "object"
      ? payment.orderId?._id || payment.orderId?.id
      : payment?.orderId;

  return {
    razorpay: {
      key: razorpay.key,
      orderId: razorpay.orderId,
      amount: Number(razorpay.amount),
      currency: razorpay.currency || "INR",
    },
    paymentId: payment?._id || payment?.id,
    orderId: nestedOrderId ? String(nestedOrderId) : payload.orderId,
  };
};

export const verifyPayment = async (
  payload: VerifyPaymentPayload
): Promise<VerifyPaymentResult> => {
  const guestOrderToken = getAccessToken() ? "" : getGuestOrderToken();
  const response = await axios.post<RawVerifyPaymentResponse>(
    "/user/payments/verification",
    payload,
    guestOrderToken
      ? { headers: { "X-Guest-Order-Token": guestOrderToken } }
      : undefined
  );

  const order = response.data?.data?.order;

  if (!order) {
    throw new Error("Payment verified, but order details were unavailable.");
  }

  return {
    order: mapOrder(order),
    paymentStatus: response.data?.data?.payment?.status,
  };
};
