"use client";

import ProductGrid from "@/components/product/ProductGrid";
import HeroSection from "@/components/ui/HeroSection";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();

  return (
    <>
      <HeroSection
        title="Our Products"
        image="/assets/productHero.webp"
        ctaText="Contact Us"
        onCtaClick={() => router.push("/contactUs")}
      />

      <main className="bg-gradient-to-b from-orange-50 via-white to-white">
        <ProductGrid
          badge="Our Products"
          title="Explore the complete Masala collection"
          description="Browse every spice category with dedicated sections for whole spices, blended spices, and powder spices."
          groupByCategory
        />
      </main>
    </>
  );
}
