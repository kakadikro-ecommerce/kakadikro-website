"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductDetails from "@/components/product/ProductDetails";
import ProductGrid from "@/components/product/ProductGrid";
import ProductReviewsSection from "@/components/reviews/ProductReviewsSection";
import HeroSection from "@/components/ui/HeroSection";
import Loader from "@/components/ui/Loader";
import Slider from "@/components/ui/Slider";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { getProductTypeCatalog } from "@/lib/productTypeCatalog";
import { getRelatedProducts } from "@/redux/api/productApi";
import {
  clearSelectedProduct,
  fetchProductBySlug,
} from "@/redux/slice/productSlice";
import type { Product } from "@/types/product";
import FAQSection from "@/components/ui/FaqSection";
import { trackOrderFAQs } from "@/utils/constants";

export default function ProductPageClient() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const productRef = useRef<HTMLDivElement | null>(null);
  const slug = params?.slug;
  const dispatch = useAppDispatch();
  const { selectedProduct, selectedLoading, selectedError } = useAppSelector(
    (state) => state.products
  );
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

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
    if (!slug) {
      return;
    }

    let cancelled = false;

    const loadRelated = async () => {
      try {
        const products = await getRelatedProducts(slug, 4);
        if (!cancelled) {
          setRelatedProducts(products);
        }
      } catch {
        if (!cancelled) {
          setRelatedProducts([]);
        }
      }
    };

    void loadRelated();

    return () => {
      cancelled = true;
    };
  }, [slug]);

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

  if (selectedLoading) {
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

  const typeCatalog = getProductTypeCatalog(selectedProduct.productType);
  const isElectronics =
    String(selectedProduct.productType || "").toUpperCase() === "ELECTRONICS";

  return (
    <main>
      <HeroSection
        title={isElectronics ? "Electronics" : "Our Products"}
        image="/assets/productHero.webp"
        ctaText="Contact Us"
        onCtaClick={() => router.push("/contactUs")}
      />
      <Slider />
      <div ref={productRef}>
        <ProductDetails product={selectedProduct} />
      </div>
      {relatedProducts.length > 0 ? (
        <ProductGrid
          badge="Related Products"
          title={typeCatalog.relatedTitle}
          description={typeCatalog.relatedDescription}
          limit={4}
          showViewAllButton
          viewAllHref={
            selectedProduct.productType
              ? `/products?type=${selectedProduct.productType}`
              : "/products"
          }
          products={relatedProducts}
        />
      ) : null}
      {selectedProduct.id || selectedProduct._id ? (
        <ProductReviewsSection
          productId={selectedProduct.id || selectedProduct._id || ""}
          showStaticReviews={false}
        />
      ) : null}
      <FAQSection faqs={trackOrderFAQs} />
    </main>
  );
}
