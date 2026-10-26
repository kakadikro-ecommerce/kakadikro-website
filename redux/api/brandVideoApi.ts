import axios from "@/lib/axios";

export interface BrandStoryProduct {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  price?: number | null;
  mrp?: number | null;
  variantName?: string;
}

export interface BrandStory {
  id: string;
  sortOrder: number;
  video: {
    url: string;
  } | null;
  product: BrandStoryProduct | null;
}

export const getBrandStories = async (): Promise<BrandStory[]> => {
  const response = await axios.get("/user/brand-videos");
  const payload = response.data;
  const items = Array.isArray(payload?.data) ? payload.data : [];

  return items.filter(
    (item: BrandStory) => Boolean(item?.video?.url && item?.product?.slug)
  );
};
