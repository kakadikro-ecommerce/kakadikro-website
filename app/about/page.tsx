"use client";

import AboutPreview from "@/components/aboutUs/aboutPreview"
import CustomerReviews from "@/components/ui/CustomerReviews"
import HeroSection from "@/components/ui/HeroSection";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <main>
      <HeroSection
        title="About Us"
        image="/assets/abouthero.webp"
        ctaText="Contact Us"
        onCtaClick={() => router.push("/contactUs")}
      />
      <AboutPreview />
      <CustomerReviews />
    </main>
  )
}

export default Page
