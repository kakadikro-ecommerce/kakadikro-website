import axios from "@/lib/axios";
import type {
  CreateOrderPayload,
  Order,
  OrderItem,
  OrdersPagination,
  OrdersResponse,
  PaymentMethod,
  PaymentStatus,
  ShipmentDetails,
  ShippingAddress,
  OrderStatus,
} from "@/types/order";

interface RawOrderItem {
  product?: {
    _id?: string;
    id?: string;
    images?: Array<{ url?: string }>;
  } | string;
  productId?: string;
  name?: string;
  image?: string;
  productImage?: string;
  weight?: string;
  price?: number;
  unitPrice?: number;
  quantity?: number;
}

interface RawOrder {
  _id?: string;
  id?: string;
  orderNumber?: string;
  items?: RawOrderItem[];
  shippingAddress?: Partial<ShippingAddress>;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;
  subtotal?: number;
  totalAmount?: number;
  notes?: string;
  adminNote?: string;
  createdAt?: string;
  updatedAt?: string;
  paidAt?: string;
  shipment?: ShipmentDetails;
}

interface RawOrdersResponse {
  data?: RawOrder[];
  pagination?: OrdersPagination;
}

interface RawOrderResponse {
  data?: RawOrder;
}

const DEFAULT_IMAGE = "/assets/kde-logo.webp";

const normalizePaymentMethod = (value?: string): PaymentMethod => {
  return value === "cod" ? value : "cod";
};

const normalizePaymentStatus = (value?: string): PaymentStatus => {
  switch (value) {
    case "paid":
    case "failed":
    case "refunded":
      return value;
    default:
      return "pending";
  }
};

const normalizeOrderStatus = (value?: string): OrderStatus => {
  switch (value) {
    case "confirmed":
    case "dispatched":
    case "delivered":
    case "cancelled":
      return value;
    default:
      return "pending";
  }
};

const mapShippingAddress = (
  address?: Partial<ShippingAddress>
): ShippingAddress => ({
  fullName: address?.fullName || "",
  phone: address?.phone || "",
  addressLine1: address?.addressLine1 || "",
  addressLine2: address?.addressLine2 || "",
  city: address?.city || "",
  state: address?.state || "",
  postalCode: address?.postalCode || "",
  country: address?.country || "India",
});

const mapOrderItem = (item: RawOrderItem): OrderItem => {
  const product =
    item.product && typeof item.product === "object" ? item.product : undefined;

  return {
    productId:
      item.productId ||
      product?._id ||
      product?.id ||
      (typeof item.product === "string" ? item.product : "") ||
      "",
    name: item.name || "Order item",
    image:
      item.productImage ||
      item.image ||
      product?.images?.[0]?.url ||
      DEFAULT_IMAGE,
    weight: item.weight || "",
    price: item.unitPrice ?? item.price ?? 0,
    quantity: item.quantity ?? 1,
  };
};

const mapOrder = (order: RawOrder): Order => ({
  id: order._id || order.id || "",
  orderNumber: order.orderNumber,
  items: Array.isArray(order.items) ? order.items.map(mapOrderItem) : [],
  shippingAddress: mapShippingAddress(order.shippingAddress),
  paymentMethod: normalizePaymentMethod(order.paymentMethod),
  paymentStatus: normalizePaymentStatus(order.paymentStatus),
  orderStatus: normalizeOrderStatus(order.orderStatus),
  subtotal: order.subtotal ?? 0,
  totalAmount: order.totalAmount ?? 0,
  notes: order.notes,
  adminNote: order.adminNote,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  paidAt: order.paidAt,
  shipment: order.shipment,
});

const parseOrderResponse = (payload: RawOrderResponse): Order => {
  return mapOrder(payload.data || {});
};

const parseOrdersResponse = (payload: RawOrdersResponse): OrdersResponse => {
  return {
    orders: Array.isArray(payload.data) ? payload.data.map(mapOrder) : [],
    pagination: payload.pagination || null,
  };
};

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  const response = await axios.post<RawOrderResponse>("/v1/user/orders", payload);
  return parseOrderResponse(response.data);
};

export const getMyOrders = async (): Promise<OrdersResponse> => {
  const response = await axios.get<RawOrdersResponse>("/v1/user/orders");
  return parseOrdersResponse(response.data);
};

export const updateOrder = async (id: string, payload: { shippingAddress?: ShippingAddress; notes?: string }
): Promise<Order> => {
  const response = await axios.put<RawOrderResponse>(
    `/v1/user/orders/${id}`,
    payload
  );

  return parseOrderResponse(response.data);
};

export const trackOrder = async (id: string): Promise<Order> => {
  if (!id?.trim()) {
    throw new Error("Order id is required.");
  }

  const response = await axios.get<RawOrderResponse>(`/v1/user/orders/tracking/${id}`);
  return parseOrderResponse(response.data);
};

export const cancelOrder = async (id: string): Promise<Order> => {
  const response = await axios.put<RawOrderResponse>(`/v1/user/orders/cancel/${id}`);
  return parseOrderResponse(response.data);
};
