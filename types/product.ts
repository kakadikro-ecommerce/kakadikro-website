export interface ProductImage {
  url: string;
  altText?: string;
}

export type ProductType = "GROCERY" | "ELECTRONICS";

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
