"use client";

import { useRouter } from "next/navigation";

import AboutPreview from "@/components/aboutUs/aboutPreview";
import CustomerReviews from "@/components/ui/CustomerReviews";
import HeroSection from "@/components/ui/HeroSection";
import WhoWeAre from "@/components/aboutUs/whoWeAre";
import Slider from "@/components/ui/Slider";
import FAQSection from "@/components/ui/FaqSection";
import { generalFaqs } from "@/utils/constants";

export default function AboutPageClient() {
  const router = useRouter();

  return (
    <main>
      <HeroSection
        title="About Us"
        image="/assets/abouthero.webp"
        ctaText="Contact Us"
        onCtaClick={() => router.push("/contactUs")}
      />
      <Slider />
      <WhoWeAre />
      <AboutPreview showCTA={false}/>
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
