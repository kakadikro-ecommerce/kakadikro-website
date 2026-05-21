"use client";

import { useRouter } from "next/navigation";

import AboutPreview from "@/components/aboutUs/aboutPreview";
import CustomerReviews from "@/components/ui/CustomerReviews";
import ContactUs from "@/components/ui/ContactUs";
import HeroSection from "@/components/ui/HeroSection";
import Slider from "@/components/ui/Slider";

export default function ContactUsPageClient() {
  const router = useRouter();

  return (
    <main>
      <HeroSection
        title="Contact Us"
        image="/assets/contactHero.webp"
        ctaText="Our Products"
        onCtaClick={() => router.push("/products")}
      />
      <Slider />
      <AboutPreview />
      <ContactUs />
      <CustomerReviews />
    </main>
  );
}
