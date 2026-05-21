import axios from "@/lib/axios";
import type { Product } from "@/types/product";

interface ProductsResponse {
  data?: Product[];
  products?: Product[];
  pagination?: any;
}

interface ProductResponse {
  data?: Product;
  product?: Product;
}

const parseProductsResponse = (payload: Product[] | ProductsResponse): Product[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  return [];
};

const parseProductResponse = (payload: Product | ProductResponse): Product => {
  if (payload && !Array.isArray(payload) && "name" in payload) {
    return payload as Product;
  }

  if (payload && !Array.isArray(payload) && "data" in payload && payload.data) {
    return payload.data;
  }

  if (payload && !Array.isArray(payload) && "product" in payload && payload.product) {
    return payload.product;
  }

  throw new Error("Product not found.");
};

export const getAllProducts = async (params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await axios.get("/v1/user/products", { params });

  return {
    items: parseProductsResponse(response.data),
    pagination: response.data.pagination,
  };
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const response = await axios.get<Product | ProductResponse>(`/v1/user/products/${slug}`);
    return parseProductResponse(response.data);
  } catch {
    const fallbackResponse = await axios.get<Product | ProductResponse>(`/v1/user/products/${slug}`);
    return parseProductResponse(fallbackResponse.data);
  }
};
