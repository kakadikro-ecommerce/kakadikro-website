"use client";

import { useRouter } from "next/navigation";

import ProductGrid from "@/components/product/ProductGrid";
import HeroSection from "@/components/ui/HeroSection";
import Slider from "@/components/ui/Slider";
import TrackOrder from "@/components/trackOrder/trackOrder";
import FAQSection from "@/components/ui/FaqSection";
import { trackOrderFAQs } from "@/utils/constants";

export default function TrackOrderPageClient() {
  const router = useRouter();

  return (
    <main>
      <HeroSection
        title="Track Your Order"
        image="/assets/orderHero.webp"
        ctaText="Our Products"
        onCtaClick={() => router.push("/products")}
      />
      <Slider />
      <TrackOrder />
      <h1 className="text-xl sm:text-3xl font-semibold text-center text-[#003d4d] mt-10 mb-6">
        While You Wait, Discover Our Bestsellers
      </h1>
      <p className="text-lg text-gray-900 text-center mb-6">
        Fresh, authentic masalas crafted with love from Gujarat
      </p>
      <ProductGrid limit={4} showViewAllButton />
      <FAQSection
        badge="Order Help"
        title="Track Your Order"
        description="Find answers related to order tracking and delivery."
        faqs={trackOrderFAQs}
      />
    </main>
  );
}
