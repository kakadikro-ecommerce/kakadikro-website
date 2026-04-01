import axios from "@/lib/axios";
import type { CartItem, CartSummary, ProductVariant } from "@/types/product";

interface RawCartItem {
  _id?: string;
  id?: string;
  product?: {
    _id?: string;
    id?: string;
    slug?: string;
    category?: string;
    images?: Array<{ url?: string }>;
  } | string;
  productId?: string;
  slug?: string;
  name?: string;
  productImage?: string;
  image?: string;
  category?: string;
  weight?: string;
  unitPrice?: number;
  price?: number;
  mrp?: number;
  stock?: number;
  quantity?: number;
}

interface RawCartSummary {
  items?: RawCartItem[];
  subtotal?: number;
  totalItems?: number;
}

interface CartResponse {
  data?: RawCartSummary;
  cart?: RawCartSummary;
  items?: RawCartItem[];
  subtotal?: number;
  totalItems?: number;
}

const buildVariant = (item: RawCartItem): ProductVariant => ({
  weight: item.weight || "",
  price: item.unitPrice ?? item.price ?? 0,
  mrp: item.mrp,
  stock: item.stock,
});

const mapCartItem = (item: RawCartItem): CartItem => {
  const product =
    item.product && typeof item.product === "object" ? item.product : undefined;

  return {
    cartItemId: item._id || item.id || "",
    productId: item.productId || product?._id || product?.id || (typeof item.product === "string" ? item.product : ""),
    slug: item.slug || product?.slug || "",
    name: item.name || "Cart item",
    image: item.productImage || item.image || product?.images?.[0]?.url || "/kde-logo-1.png",
    category: item.category || product?.category,
    variant: buildVariant(item),
    quantity: item.quantity ?? 1,
  };
};

const parseCartResponse = (payload: CartResponse | RawCartSummary): CartSummary => {
  const source =
    payload && "data" in payload && payload.data
      ? payload.data
      : payload && "cart" in payload && payload.cart
        ? payload.cart
        : payload;

  const items = Array.isArray(source?.items) ? source.items.map(mapCartItem) : [];
  const subtotal =
    typeof source?.subtotal === "number"
      ? source.subtotal
      : items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
  const totalItems =
    typeof source?.totalItems === "number"
      ? source.totalItems
      : items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    subtotal,
    totalItems,
  };
};

export const getMyCart = async (): Promise<CartSummary> => {
  const response = await axios.get<CartResponse>("/v1/user/cart");
  return parseCartResponse(response.data);
};

export const addItemToCart = async (payload: {
  productId: string;
  weight: string;
  quantity: number;
}): Promise<CartSummary> => {
  const response = await axios.post<CartResponse>("/v1/user/cart/items", payload);
  return parseCartResponse(response.data);
};

export const updateCartItemQuantity = async (
  itemId: string,
  payload: { quantity: number }
): Promise<CartSummary> => {
  const response = await axios.put<CartResponse>(`/v1/user/cart/items/${itemId}`, payload);
  return parseCartResponse(response.data);
};

export const removeCartItem = async (itemId: string): Promise<CartSummary> => {
  const response = await axios.delete<CartResponse>(`/v1/user/cart/items/${itemId}`);
  return parseCartResponse(response.data);
};

export const clearCart = async (): Promise<CartSummary> => {
  const response = await axios.delete<CartResponse>("/v1/user/cart");
  return parseCartResponse(response.data);
};
