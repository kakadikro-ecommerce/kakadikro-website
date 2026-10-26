"use client";

import ProductGrid from "@/components/product/ProductGrid";
import HeroCarousel from "@/components/ui/HeroCarousel";
import CustomerReviews from "@/components/ui/CustomerReviews";
import WhyChooseUs from "@/components/ui/whyChooseUs";
import ProductProcess from "@/components/product/ProductProcess";
import ProductLines from "@/components/ui/ProductLines";
import BrandStories from "@/components/ui/BrandStories";
import FAQSection from "@/components/ui/FaqSection";
import { getProductTypeCatalog } from "@/lib/productTypeCatalog";
import { generalFaqs } from "@/utils/constants";

export default function HomePageClient() {
  const groceryCatalog = getProductTypeCatalog("CROSSLIFE");
  const electronicsCatalog = getProductTypeCatalog("CROSSLINE");

  return (
    <main>
      <HeroCarousel />
      <WhyChooseUs />
      <ProductLines />
      <BrandStories />
      <ProductGrid
        badge="Cross Life — Foods & Spices"
        title={groceryCatalog.listingTitle}
        description={groceryCatalog.listingDescription}
        fixedProductType="CROSSLIFE"
        limit={4}
        showViewAllButton
        viewAllHref="/products?type=CROSSLIFE"
      />
      <ProductProcess line="life" />
      <ProductGrid
        badge="Cross Line — Agri Equipment"
        title={electronicsCatalog.listingTitle}
        description={electronicsCatalog.listingDescription}
        fixedProductType="CROSSLINE"
        limit={4}
        showViewAllButton
        viewAllHref="/products?type=CROSSLINE"
      />
      <ProductProcess line="line" />
      <CustomerReviews />
      <FAQSection faqs={generalFaqs} />
    </main>
  );
}
