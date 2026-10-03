"use client";

import { useSearchParams } from "next/navigation";

import ProductGrid from "@/components/product/ProductGrid";
import HeroSection from "@/components/ui/HeroSection";
import FAQSection from "@/components/ui/FaqSection";
import { getProductTypeCatalog } from "@/lib/productTypeCatalog";
import { resolveProductType } from "@/types/product";
import { trackOrderFAQs } from "@/utils/constants";

export default function ProductsPageClient() {
  const searchParams = useSearchParams();
  const typeParam = resolveProductType(searchParams.get("type"));
  const isElectronics = typeParam === "CROSSLINE";
  const isGrocery = typeParam === "CROSSLIFE";

  const image = isElectronics
    ? "/assets/banner4.png"
    : isGrocery
      ? "/assets/banner5.png"
      : "/assets/banner.png";
  const catalog = isElectronics
    ? getProductTypeCatalog("CROSSLINE")
    : isGrocery
      ? getProductTypeCatalog("CROSSLIFE")
      : null;

  return (
    <>
      {catalog ? (
        <HeroSection
          image={image}
          alt={isElectronics ? "Kaka Dikro electronics" : "Kaka Dikro grocery"}
          title={catalog.heroTitle}
          description={catalog.listingDescription}
          className={isGrocery ? "text-[#1f7a34]" : "text-white"}
          panelClassName={
            isGrocery
              ? "absolute top-[49%] left-[4.46%] max-w-[90%] sm:max-w-[34%]"
              : "absolute top-[30%] left-[3.87%] max-w-[90%] sm:max-w-[36%]"
          }
          contentClassName="items-start"
          buttonClassName={
            isGrocery
              ? "rounded-full bg-[#1f7a34] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#25913e] sm:px-5 shadow-md transition duration-300 ease-out hover:-translate-y-1 hover:scale-105"
              : undefined
          }
          primaryCta={{ label: "Cross Line", href: "/products?type=CROSSLINE" }}
          secondaryCta={{ label: "Cross Life", href: "/products?type=CROSSLIFE" }}
        />
      ) : (
        <HeroSection
          image={image}
          alt="Kaka Dikro products"
          layout="split"
          secondaryCta={{ label: "Cross Line", href: "/products?type=CROSSLINE" }}
          primaryCta={{ label: "Cross Life", href: "/products?type=CROSSLIFE" }}
        />
      )}
      <main>
        <ProductGrid limit={12} showControls />
        <FAQSection faqs={trackOrderFAQs} />
      </main>
    </>
  );
}
