export interface ProductImage {
  url: string;
  altText?: string;
}

export interface ProductVideo {
  url: string;
  altText?: string;
}

export type ProductType = "CROSSLIFE" | "CROSSLINE";

const PRODUCT_TYPE_ALIASES: Record<string, ProductType> = {
  CROSSLIFE: "CROSSLIFE",
  CROSSLINE: "CROSSLINE",
  GROCERY: "CROSSLIFE",
  ELECTRONICS: "CROSSLINE",
  EQUIPMENT: "CROSSLINE",
};

export const resolveProductType = (value?: string | null): ProductType | "" => {
  const normalized = String(value || "").trim().toUpperCase();
  return PRODUCT_TYPE_ALIASES[normalized] || "";
};

export const isCrossLifeType = (value?: string | null) =>
  resolveProductType(value) === "CROSSLIFE";

export const isCrossLineType = (value?: string | null) =>
  resolveProductType(value) === "CROSSLINE";

export interface ProductVariant {
  /** Preferred display / cart key */
  name?: string;
  /** Legacy grocery field — still used by older products and cart payloads */
  weight?: string;
  price: number;
  mrp?: number;
  stock?: number;
  attributes?: Record<string, string>;
}

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  productType?: ProductType;
  category?: string;
  brand?: string;
  images: ProductImage[];
  video?: ProductVideo | null;
  variants: ProductVariant[];
  specifications?: Record<string, string>;
  ingredients?: string[];
  features?: string[];
  benefits?: string[];
  usage?: string;
  rating?: number;
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  category?: string;
  variant: ProductVariant;
  quantity: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}
