"use client";

import { useEffect, useState } from "react";

import {
  getActiveHeroBannerImage,
  getHeroBannerFallback,
  type HeroBannerPlacement,
} from "@/redux/api/heroBannerApi";
import { preloadImage } from "@/lib/preloadImage";

export function useHeroBannerImage(
  placement: HeroBannerPlacement | null | undefined,
  fallback?: string
) {
  const resolvedFallback =
    fallback || getHeroBannerFallback(placement || "HOME");
  const [image, setImage] = useState(resolvedFallback);

  useEffect(() => {
    const nextFallback = fallback || getHeroBannerFallback(placement || "HOME");
    setImage(nextFallback);

    if (!placement || placement === "HOME") {
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const url = await getActiveHeroBannerImage(placement, nextFallback);
        if (!url || url === nextFallback) {
          if (!cancelled) setImage(nextFallback);
          return;
        }

        const readyUrl = await preloadImage(url);
        if (!cancelled) {
          setImage(readyUrl);
        }
      } catch {
        if (!cancelled) {
          setImage(nextFallback);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [placement, fallback]);

  return image;
}
