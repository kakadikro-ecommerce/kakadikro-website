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
        image="/assets/banner2.png"
        alt="About Kaka Dikro"
        // eyebrow="Our Story"
        title="About Us"
        description="Kakadikro brings authentic groceries and dependable everyday tools together, chosen with care for homes that want quality they can trust."
        className="text-[#1f7a34]"
        contentClassName="items-center py-4 pl-[7.53%] pr-4 sm:py-8 sm:pr-8"
        buttonClassName="rounded-full bg-[#1f7a34] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#25913e] sm:px-5 shadow-md transition duration-300 ease-out hover:-translate-y-1 hover:scale-105"
        primaryCta={{ label: "Our Products", href: "/products" }}
        secondaryCta={{ label: "Contact Us", href: "/contactUs" }}
      />
      <WhoWeAre />
      <AboutPreview showCTA={false}/>
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
