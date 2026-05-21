export interface ProductImage {
  url: string;
  altText?: string;
}

export interface ProductVariant {
  weight: string;
  price: number;
  mrp?: number;
  stock?: number;
}

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category?: string;
  brand?: string;
  images: ProductImage[];
  variants: ProductVariant[];
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
