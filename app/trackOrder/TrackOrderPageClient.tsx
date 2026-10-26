"use client";

import ProductGrid from "@/components/product/ProductGrid";
import HeroSection from "@/components/ui/HeroSection";
import TrackOrder from "@/components/trackOrder/trackOrder";
import FAQSection from "@/components/ui/FaqSection";
import { trackOrderFAQs } from "@/utils/constants";

export default function TrackOrderPageClient() {
  return (
    <main>
      <HeroSection
        image="/assets/heroes/hero-crosslife.webp"
        fallbackImage="/assets/heroes/hero-crosslife.webp"
        alt="Track your Kaka Dikro order"
      />
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
        title="Order Tracking FAQs"
        description="Quick answers while you wait for your delivery."
        faqs={trackOrderFAQs}
      />
    </main>
  );
}
