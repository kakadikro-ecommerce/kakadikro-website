"use client";

import AboutPreview from "@/components/aboutUs/aboutPreview"
import CustomerReviews from "@/components/ui/CustomerReviews"
import ContactUs from "@/components/ui/ContactUs"
import HeroSection from "@/components/ui/HeroSection";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <main>
      <HeroSection
        title="Contact Us"
        image="/assets/contactHero.webp"
        ctaText="Our Products"
        onCtaClick={() => router.push("/product")}
      />
      <AboutPreview />
      <ContactUs />
      <CustomerReviews />
    </main>
  )
}

export default Page
