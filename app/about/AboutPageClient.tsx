"use client";

import AboutPreview from "@/components/aboutUs/aboutPreview";
import CustomerReviews from "@/components/ui/CustomerReviews";
import HeroSection from "@/components/ui/HeroSection";
import WhoWeAre from "@/components/aboutUs/whoWeAre";
import FAQSection from "@/components/ui/FaqSection";
import { generalFaqs } from "@/utils/constants";
import ProductLines from "@/components/ui/ProductLines";

export default function AboutPageClient() {
  return (
    <main>
      <HeroSection
        image="/assets/heroes/hero-crosslife2.webp"
        fallbackImage="/assets/heroes/hero-crosslife.webp"
        alt="About Kaka Dikro"
      />
      <WhoWeAre />
      <AboutPreview showCTA={false} />
      <ProductLines />
      <CustomerReviews />
      <FAQSection
        badge="General FAQs"
        title="General Questions"
        description="Find answers to frequently asked questions."
        faqs={generalFaqs}
      />
    </main>
  );
}
