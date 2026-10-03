"use client";

import ProductGrid from "@/components/product/ProductGrid";
import HeroSection from "@/components/ui/HeroSection";
import CustomerReviews from "@/components/ui/CustomerReviews";
import WhyChooseUs from "@/components/ui/whyChooseUs";
import AboutPreview from "@/components/aboutUs/aboutPreview";
import ProductProcess from "@/components/product/ProductProcess";
import ProductLines from "@/components/ui/ProductLines";
import FAQSection from "@/components/ui/FaqSection";
import { getProductTypeCatalog } from "@/lib/productTypeCatalog";
import { generalFaqs } from "@/utils/constants";

export default function HomePageClient() {
  const groceryCatalog = getProductTypeCatalog("CROSSLIFE");
  const electronicsCatalog = getProductTypeCatalog("CROSSLINE");

  return (
    <main>
      <HeroSection
        image="/assets/banner.png"
        alt="Kaka Dikro grocery and tools"
        layout="split"
        secondaryCta={{ label: "Cross Line — Agri Equipment", href: "/products?type=CROSSLINE" }}
        primaryCta={{ label: "Cross Life — Foods & Spices", href: "/products?type=CROSSLIFE" }}
      />
      <WhyChooseUs />
      <ProductLines />
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
      {/* <AboutPreview /> */}
      <CustomerReviews />
      <FAQSection faqs={generalFaqs} />
    </main>
  );
}
