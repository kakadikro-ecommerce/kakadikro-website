"use client";

import ProductGrid from "@/components/product/ProductGrid";
import Carousel from "@/components/ui/carousel";
import CustomerReviews from "@/components/ui/CustomerReviews";
// import Slider from "@/components/ui/Slider";
import WhyChooseUs from "@/components/ui/whyChooseUs";
import AboutPreview from "@/components/aboutUs/aboutPreview";
import ProductProcess from "@/components/product/ProductProcess";
import FAQSection from "@/components/ui/FaqSection";
import { getProductTypeCatalog } from "@/lib/productTypeCatalog";
import { generalFaqs } from "@/utils/constants";

export default function HomePageClient() {
  const groceryCatalog = getProductTypeCatalog("GROCERY");
  const electronicsCatalog = getProductTypeCatalog("ELECTRONICS");

  return (
    <main>
      <Carousel />
      {/* <Slider /> */}
      <WhyChooseUs />
      <ProductGrid
        badge="Grocery"
        title={groceryCatalog.listingTitle}
        description={groceryCatalog.listingDescription}
        fixedProductType="GROCERY"
        limit={4}
        showViewAllButton
        viewAllHref="/products?type=GROCERY"
      />
      <ProductGrid
        badge="Electronics"
        title={electronicsCatalog.listingTitle}
        description={electronicsCatalog.listingDescription}
        fixedProductType="ELECTRONICS"
        limit={4}
        showViewAllButton
        viewAllHref="/products?type=ELECTRONICS"
      />
      <AboutPreview />
      <ProductProcess />
      <CustomerReviews />
      <FAQSection faqs={generalFaqs} />
    </main>
  );
}
