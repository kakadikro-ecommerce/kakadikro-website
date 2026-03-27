export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "dispatched",
  "delivered",
  "cancelled",
] as const;

export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

export const PAYMENT_METHODS = ["cod"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  weight: string;
  price: number;
  quantity: number;
}

export interface ShipmentDetails {
  trackingId?: string;
  courierName?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  totalAmount: number;
  notes?: string;
  adminNote?: string;
  shipment?: ShipmentDetails;
  createdAt?: string;
  updatedAt?: string;
  paidAt?: string;
}

export interface OrdersPagination {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: OrdersPagination | null;
}

export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface CancelOrderPayload {
  orderId: string;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

export const EMPTY_SHIPPING_ADDRESS: ShippingAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export const CANCELLABLE_ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed"];

export const canCancelOrder = (status?: OrderStatus | null) =>
  !!status && CANCELLABLE_ORDER_STATUSES.includes(status);
