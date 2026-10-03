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
  let product: Product | undefined;

  if (payload && !Array.isArray(payload) && "name" in payload) {
    product = payload as Product;
  } else if (payload && !Array.isArray(payload) && "data" in payload && payload.data) {
    product = payload.data;
  } else if (payload && !Array.isArray(payload) && "product" in payload && payload.product) {
    product = payload.product;
  }

  if (!product) {
    throw new Error("Product not found.");
  }

  const id = String(product.id || (product as Product & { _id?: string })._id || "").trim();
  return {
    ...product,
    id: id || product.id,
    _id: (product as Product & { _id?: string })._id || id || product._id,
  };
};

const normalizeProductList = (items: Product[]): Product[] =>
  items.map((item) => {
    const id = String(item.id || (item as Product & { _id?: string })._id || "").trim();
    return {
      ...item,
      id: id || item.id,
      _id: (item as Product & { _id?: string })._id || id || item._id,
    };
  });

export const getAllProducts = async (params?: {
  search?: string;
  category?: string;
  productType?: "CROSSLIFE" | "CROSSLINE";
  page?: number;
  limit?: number;
}) => {
  const queryParams: Record<string, string | number> = {};

  if (params?.search) queryParams.search = params.search;
  if (params?.category) queryParams.category = params.category;
  if (params?.productType) queryParams.productType = params.productType;
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;

  const response = await axios.get("/user/products", { params: queryParams });

  return {
    items: normalizeProductList(parseProductsResponse(response.data)),
    pagination: response.data.pagination,
  };
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const response = await axios.get<Product | ProductResponse>(`/user/products/${slug}`);
    return parseProductResponse(response.data);
  } catch {
    const fallbackResponse = await axios.get<Product | ProductResponse>(`/user/products/${slug}`);
    return parseProductResponse(fallbackResponse.data);
  }
};

export const getRelatedProducts = async (slug: string, limit = 4): Promise<Product[]> => {
  const response = await axios.get(`/user/products/${slug}/related`, {
    params: { limit },
  });

  return normalizeProductList(parseProductsResponse(response.data));
};
