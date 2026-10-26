"use client";

import { useSearchParams } from "next/navigation";

import ProductGrid from "@/components/product/ProductGrid";
import HeroSection from "@/components/ui/HeroSection";
import FAQSection from "@/components/ui/FaqSection";
import { useHeroBannerImage } from "@/hooks/useHeroBannerImage";
import { getHeroBannerFallback } from "@/redux/api/heroBannerApi";
import { resolveProductType } from "@/types/product";
import { trackOrderFAQs } from "@/utils/constants";

export default function ProductsPageClient() {
  const searchParams = useSearchParams();
  const typeParam = resolveProductType(searchParams.get("type"));
  const productType =
    typeParam === "CROSSLINE" || typeParam === "CROSSLIFE" ? typeParam : null;

  const fallbackImage = getHeroBannerFallback(productType || "HOME");
  const image = useHeroBannerImage(productType, fallbackImage);

  return (
    <>
      <HeroSection
        image={image}
        fallbackImage={fallbackImage}
        alt={
          productType === "CROSSLINE"
            ? "Kaka Dikro Crossline"
            : productType === "CROSSLIFE"
              ? "Kaka Dikro Crosslife"
              : "Kaka Dikro products"
        }
      />
      <main>
        <ProductGrid limit={12} showControls />
        <FAQSection faqs={trackOrderFAQs} />
      </main>
    </>
  );
}
