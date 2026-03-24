"use client";

import HeroSection from "@/components/ui/HeroSection";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <main>
      <HeroSection
        title="Track Your Order"
        image="/assets/orderHero.webp"
        ctaText="Our Products"
        onCtaClick={() => router.push("/product")}
      />
    </main>
  )
}

export default Page
