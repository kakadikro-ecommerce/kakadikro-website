import axios from "@/lib/axios";
import { toCloudFrontMediaUrl } from "@/lib/image";
import type { ProductType } from "@/types/product";

export type HeroBannerPlacement = "HOME" | ProductType;

export interface HeroBanner {
  id: string;
  productType: HeroBannerPlacement;
  sortOrder?: number;
  isActive?: boolean;
  image: {
    url: string;
    altText?: string;
  } | null;
}

export const HOME_HERO_FALLBACK_IMAGES = [
  "/assets/heroes/hero-crosslife.webp",
  "/assets/heroes/hero-crosslife2.webp",
  "/assets/heroes/hero-crossline.webp",
  "/assets/heroes/hero-crossline2.webp",
] as const;

const FALLBACK_BY_PLACEMENT: Record<HeroBannerPlacement, string> = {
  HOME: HOME_HERO_FALLBACK_IMAGES[0],
  CROSSLIFE: "/assets/heroes/hero-crosslife.webp",
  CROSSLINE: "/assets/heroes/hero-crossline.webp",
};

export const getHeroBannerFallback = (placement?: HeroBannerPlacement | null) => {
  if (placement === "CROSSLINE") return FALLBACK_BY_PLACEMENT.CROSSLINE;
  if (placement === "CROSSLIFE") return FALLBACK_BY_PLACEMENT.CROSSLIFE;
  if (placement === "HOME") return FALLBACK_BY_PLACEMENT.HOME;
  return FALLBACK_BY_PLACEMENT.HOME;
};

export const getActiveHeroBanners = async (
  placement: HeroBannerPlacement
): Promise<HeroBanner[]> => {
  const response = await axios.get("/user/hero-banners", {
    params: { productType: placement },
  });
  const payload = response.data;
  const items = Array.isArray(payload?.data) ? payload.data : [];

  return items
    .filter(
      (item: HeroBanner) =>
        item?.productType === placement && Boolean(item?.image?.url)
    )
    .map((item: HeroBanner) => ({
      ...item,
      image: item.image
        ? {
            ...item.image,
            url: toCloudFrontMediaUrl(item.image.url),
          }
        : null,
    }));
};

export const getActiveHeroBanner = async (
  placement: HeroBannerPlacement
): Promise<HeroBanner | null> => {
  const items = await getActiveHeroBanners(placement);
  return items[0] || null;
};

export const getActiveHeroBannerImage = async (
  placement: HeroBannerPlacement,
  fallback?: string
): Promise<string> => {
  const resolvedFallback = fallback || getHeroBannerFallback(placement);

  try {
    const banner = await getActiveHeroBanner(placement);
    const url = banner?.image?.url?.trim();
    if (url) {
      return url;
    }
  } catch {
    // Fall through to static fallback so the hero never breaks.
  }

  return resolvedFallback;
};
