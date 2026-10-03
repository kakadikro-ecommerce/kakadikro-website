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
        image="/assets/banner3.png"
        alt="Track your Kaka Dikro order"
        eyebrow="Order Updates"
        title="Track Your Order"
        description="Enter your order details below to see where your delivery is and what happens next."
        primaryCta={{ label: "Our Products", href: "/products" }}
        secondaryCta={{ label: "Contact Us", href: "/contactUs" }}
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
        title="Track Your Order"
        description="Find answers related to order tracking and delivery."
        faqs={trackOrderFAQs}
      />
    </main>
  );
}
