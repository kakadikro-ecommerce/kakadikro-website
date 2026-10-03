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
        image="/assets/banner4.png"
        alt="Contact Kaka Dikro"
        eyebrow="Get In Touch"
        title="Contact Us"
        description="Questions about an order, a product, or a bulk request — send a message and we will get back to you."
        primaryCta={{ label: "Our Products", href: "/products" }}
        secondaryCta={{ label: "Track Your Order", href: "/trackOrder" }}
      />
      <AboutPreview />
      <ProductLines />
      <ContactUs />
      <CustomerReviews />
    </main>
  );
}
