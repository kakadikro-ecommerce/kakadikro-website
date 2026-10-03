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

export interface RawOrder {
  _id?: string;
  id?: string;
  items?: RawOrderItem[];
  shippingAddress?: Partial<ShippingAddress>;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;
  subtotal?: number;
  subtotalAmount?: number;
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
  order?: RawOrder;
}

const DEFAULT_IMAGE = "/assets/kde-logo.png";

const normalizePaymentMethod = (value?: string): PaymentMethod => {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "card" || normalized === "upi" || normalized === "cod") {
    return normalized;
  }
  return "cod";
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
    productId: String(
      item.productId ||
        product?._id ||
        product?.id ||
        (typeof item.product === "string" ? item.product : "") ||
        ""
    ).trim(),
    // Always prefer immutable order snapshots over live populated product data.
    name: item.name || "Order item",
    image: item.productImage || item.image || DEFAULT_IMAGE,
    weight: item.weight || "",
    price: item.unitPrice ?? item.price ?? 0,
    quantity: item.quantity ?? 1,
  };
};

const pickOrderId = (order: RawOrder): string =>
  String(order._id || order.id || "").trim();

export const mapOrder = (order: RawOrder): Order => {
  const id = pickOrderId(order);

  return {
    id,
    items: Array.isArray(order.items) ? order.items.map(mapOrderItem) : [],
    shippingAddress: mapShippingAddress(order.shippingAddress),
    paymentMethod: normalizePaymentMethod(order.paymentMethod),
    paymentStatus: normalizePaymentStatus(order.paymentStatus),
    orderStatus: normalizeOrderStatus(order.orderStatus),
    subtotal: order.subtotalAmount ?? order.subtotal ?? 0,
    totalAmount: order.totalAmount ?? 0,
    notes: order.notes,
    adminNote: order.adminNote,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    paidAt: order.paidAt,
    shipment: order.shipment,
  };
};

export const getOrderDisplayId = (order?: Pick<Order, "id"> | null) =>
  order?.id || "";

const extractRawOrder = (payload: RawOrderResponse | RawOrder): RawOrder => {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  if ("data" in payload && payload.data && typeof payload.data === "object") {
    return payload.data;
  }

  if ("order" in payload && payload.order && typeof payload.order === "object") {
    return payload.order;
  }

  return payload as RawOrder;
};

export const parseOrderResponse = (
  payload: RawOrderResponse | RawOrder
): Order => {
  return mapOrder(extractRawOrder(payload));
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
  const response = await axios.post<RawOrderResponse>("/user/orders", payload);
  return parseOrderResponse(response.data);
};

export const getMyOrders = async (): Promise<OrdersResponse> => {
  const response = await axios.get<RawOrdersResponse>("/user/orders");
  return parseOrdersResponse(response.data);
};

export const updateOrder = async (
  id: string,
  payload: { shippingAddress?: ShippingAddress; notes?: string }
): Promise<Order> => {
  const response = await axios.put<RawOrderResponse>(
    `/user/orders/${id}`,
    payload
  );

  return parseOrderResponse(response.data);
};

export const trackOrder = async (id: string): Promise<Order> => {
  if (!id?.trim()) {
    throw new Error("Order id is required.");
  }

  const response = await axios.get<RawOrderResponse>(
    `/user/orders/tracking/${id}`
  );
  return parseOrderResponse(response.data);
};

export const cancelOrder = async (id: string): Promise<Order> => {
  const response = await axios.put<RawOrderResponse>(
    `/user/orders/cancel/${id}`
  );
  return parseOrderResponse(response.data);
};
