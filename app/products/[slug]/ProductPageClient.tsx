"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

import ProductDetails from "@/components/product/ProductDetails";
import ProductGrid from "@/components/product/ProductGrid";
import HeroSection from "@/components/ui/HeroSection";
import Loader from "@/components/ui/Loader";
import Slider from "@/components/ui/Slider";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  clearSelectedProduct,
  fetchProductBySlug,
  fetchProducts,
} from "@/redux/slice/productSlice";
import FAQSection from "@/components/ui/FaqSection";
import { trackOrderFAQs } from "@/utils/constants";

export default function ProductPageClient() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const productRef = useRef<HTMLDivElement | null>(null);
  const slug = params?.slug;
  const dispatch = useAppDispatch();
  const { items, loading, selectedProduct, selectedLoading, selectedError } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (!items.length) {
      void dispatch(fetchProducts({}));
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    if (!slug) {
      return;
    }

    void dispatch(fetchProductBySlug(slug));

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (selectedProduct && productRef.current) {
      setTimeout(() => {
        productRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    }
  }, [selectedProduct]);

  const relatedProducts = items.filter(
    (product) =>
      product.slug !== selectedProduct?.slug &&
      (!!selectedProduct?.category ? product.category === selectedProduct.category : true)
  );

  if (selectedLoading || (loading && !selectedProduct)) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Loader
          label="Preparing product details"
          className="rounded-[32px] border border-orange-100 bg-white shadow-sm"
          size="lg"
        />
      </main>
    );
  }

  if (selectedError || !selectedProduct) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-red-100 bg-red-50 p-8 text-red-700 shadow-sm">
          {selectedError || "Product not found."}
        </div>
      </main>
    );
  }

  return (
    <main>
      <HeroSection
        title="Our Products"
        image="/assets/productHero.webp"
        ctaText="Contact Us"
        onCtaClick={() => router.push("/contactUs")}
      />
      <Slider />
      <div ref={productRef}>
        <ProductDetails product={selectedProduct} />
      </div>
      <ProductGrid
        badge="Related Products"
        title="More flavours from the same collection"
        description="Explore related products below and add the right pack size directly from the listing."
        limit={4}
        showViewAllButton
        products={relatedProducts}
      />
      <FAQSection
        faqs={trackOrderFAQs}
      />
    </main>
  );
}
