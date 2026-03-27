"use client";

import { useRouter } from "next/navigation";

import ProductGrid from "@/components/product/ProductGrid";
import HeroSection from "@/components/ui/HeroSection";
import Slider from "@/components/ui/Slider";

export default function ProductsPageClient() {
  const router = useRouter();

  return (
    <>
      <HeroSection
        title="Our Products"
        image="/assets/productHero.webp"
        ctaText="Contact Us"
        onCtaClick={() => router.push("/contactUs")}
      />
      <Slider />

      <main>
        <ProductGrid
          badge="Our Products"
          title="Explore the complete Masala collection"
          description="Browse every spice category with dedicated sections for whole spices, blended spices, and powder spices."
          limit={12}
          showControls
        />
      </main>
    </>
  );
}
