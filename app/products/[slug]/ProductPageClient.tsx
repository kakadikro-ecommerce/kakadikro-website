"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import ProductDetails from "@/components/product/ProductDetails";
import ProductGrid from "@/components/product/ProductGrid";
import HeroSection from "@/components/ui/HeroSection";
import Slider from "@/components/ui/Slider";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  clearSelectedProduct,
  fetchProductBySlug,
  fetchProducts,
} from "@/redux/slice/productSlice";

export default function ProductPageClient() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
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

  const relatedProducts = items.filter(
    (product) =>
      product.slug !== selectedProduct?.slug &&
      (!!selectedProduct?.category ? product.category === selectedProduct.category : true)
  );

  if (selectedLoading || (loading && !selectedProduct)) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse rounded-[32px] border border-orange-100 bg-white p-10 shadow-sm">
          <div className="h-8 w-40 rounded bg-orange-100" />
          <div className="mt-6 h-12 w-2/3 rounded bg-orange-50" />
          <div className="mt-4 h-5 w-full rounded bg-slate-100" />
          <div className="mt-3 h-5 w-5/6 rounded bg-slate-100" />
          <div className="mt-8 h-[340px] rounded-[28px] bg-orange-50" />
        </div>
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
      <ProductDetails product={selectedProduct} />
      <ProductGrid
        badge="Related Products"
        title="More flavours from the same collection"
        description="Explore related products below and add the right pack size directly from the listing."
        limit={4}
        showViewAllButton
        products={relatedProducts}
      />
    </main>
  );
}
