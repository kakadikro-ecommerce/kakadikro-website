import axios from "@/lib/axios";

export interface ReviewUser {
  _id?: string;
  id?: string;
  name?: string;
}

export interface Review {
  _id?: string;
  id?: string;
  product?: string;
  user?: ReviewUser | string;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewsResponse {
  success?: boolean;
  message?: string;
  data?: Review[] | Review | { canReview?: boolean; verifiedPurchase?: boolean; alreadyReviewed?: boolean };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ReviewEligibility {
  canReview: boolean;
  verifiedPurchase: boolean;
  alreadyReviewed: boolean;
}

export interface CreateReviewInput {
  productId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

export const getReviewsByProductId = async (productId: string, params?: { page?: number; limit?: number }) => {
  const response = await axios.get<ReviewsResponse>(`/v1/user/products/reviews/${productId}`, { params });

  return {
    reviews: (response.data.data as Review[]) ?? [],
    pagination: response.data.pagination,
    message: response.data.message,
  };
};

export const createProductReview = async (payload: CreateReviewInput) => {
  const response = await axios.post<ReviewsResponse>("/v1/user/products/reviews", payload);

  return response.data.data as Review;
};

export const updateProductReview = async (reviewId: string, payload: UpdateReviewInput) => {
  const response = await axios.put<ReviewsResponse>(`/v1/user/products/reviews/${reviewId}`, payload);

  return response.data.data as Review;
};

export const deleteProductReview = async (reviewId: string) => {
  const response = await axios.delete<ReviewsResponse>(`/v1/user/products/reviews/${reviewId}`);

  return response.data.message;
};

export const getReviewEligibility = async (productId: string) => {
  const response = await axios.get<ReviewsResponse>(`/v1/user/products/reviews/${productId}/eligibility`);

  return response.data.data as ReviewEligibility;
};
