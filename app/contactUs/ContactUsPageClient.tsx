"use client";

import AboutPreview from "@/components/aboutUs/aboutPreview";
import CustomerReviews from "@/components/ui/CustomerReviews";
import ContactUs from "@/components/ui/ContactUs";
import HeroSection from "@/components/ui/HeroSection";
import ProductLines from "@/components/ui/ProductLines";

export default function ContactUsPageClient() {
  return (
    <main>
      <HeroSection
        image="/assets/heroes/hero-crossline.webp"
        fallbackImage="/assets/heroes/hero-crossline.webp"
        alt="Contact Kaka Dikro"
      />
      <AboutPreview />
      <ProductLines />
      <ContactUs />
      <CustomerReviews />
    </main>
  );
}
