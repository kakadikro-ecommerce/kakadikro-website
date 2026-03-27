"use client";

import ProductGrid from "@/components/product/ProductGrid";
import Carousel from "@/components/ui/carousel";
import CustomerReviews from "@/components/ui/CustomerReviews";
import Slider from "@/components/ui/Slider";
import WhyChooseUs from "@/components/ui/whyChooseUs";
import AboutPreview from "@/components/aboutUs/aboutPreview";
import ProductProcess from "@/components/product/ProductProcess";

export default function HomePageClient() {
  return (
    <main>
      <Carousel />
      <Slider />
      <WhyChooseUs />
      <ProductGrid limit={4} showViewAllButton />
      <AboutPreview />
      <ProductProcess />
      <CustomerReviews />
    </main>
  );
}
