"use client";

import { useRouter } from "next/navigation";

import ProductGrid from "@/components/product/ProductGrid";
import HeroSection from "@/components/ui/HeroSection";
import Slider from "@/components/ui/Slider";
import FAQSection from "@/components/ui/FaqSection";
import { trackOrderFAQs } from "@/utils/constants";

export default function ProductsPageClient() {
  const router = useRouter();

  return (
    <>
      <HeroSection
        title="Our Products"
        image="/assets/productsHero.jpg"
        ctaText="Contact Us"
        onCtaClick={() => router.push("/contactUs")}
      />
      <Slider />

      <main>
        <ProductGrid limit={12} showControls />
        <FAQSection faqs={trackOrderFAQs} />
      </main>
    </>
  );
}
