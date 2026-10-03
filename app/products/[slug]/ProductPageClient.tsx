"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductDetails from "@/components/product/ProductDetails";
import ProductGrid from "@/components/product/ProductGrid";
// import ProductPageIntro from "@/components/product/ProductPageIntro";
import ProductReviewsSection from "@/components/reviews/ProductReviewsSection";
import HeroSection from "@/components/ui/HeroSection";
import Loader from "@/components/ui/Loader";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { getProductTypeCatalog } from "@/lib/productTypeCatalog";
import { getRelatedProducts } from "@/redux/api/productApi";
import {
  clearSelectedProduct,
  fetchProductBySlug,
} from "@/redux/slice/productSlice";
import { isCrossLineType, resolveProductType, type Product } from "@/types/product";
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
        <div className="rounded-[32px] border border-red-100 bg-red-50 p-8 text-center shadow-sm">
          <p className="text-base font-semibold text-red-700">
            {selectedError || "Product not found."}
          </p>
          <p className="mt-2 text-sm text-red-600/80">
            Please try again or browse other products.
          </p>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="mt-6 rounded-full bg-[#7A330F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f2609]"
          >
            Browse products
          </button>
        </div>
      </main>
    );
  }

  const isElectronics = isCrossLineType(selectedProduct.productType);
  const typeCatalog = getProductTypeCatalog(
    isElectronics ? "CROSSLINE" : "CROSSLIFE",
  );

  return (
    <main>
      <HeroSection
        image={isElectronics ? "/assets/banner4.png" : "/assets/banner5.png"}
        alt={isElectronics ? "Kaka Dikro electronics" : "Kaka Dikro grocery"}
        title={typeCatalog.heroTitle}
        description={typeCatalog.listingDescription}
        className={isElectronics ? "text-white" : "text-[#1f7a34]"}
        panelClassName={
          isElectronics
            ? "absolute top-[30%] left-[3.87%] max-w-[90%] sm:max-w-[36%]"
            : "absolute top-[49%] left-[4.46%] max-w-[90%] sm:max-w-[34%]"
        }
        contentClassName="items-start"
        buttonClassName={
          isElectronics
            ? undefined
            : "rounded-full bg-[#1f7a34] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#25913e] sm:px-5 shadow-md transition duration-300 ease-out hover:-translate-y-1 hover:scale-105"
        }
        primaryCta={{ label: "Cross Line", href: "/products?type=CROSSLINE" }}
        secondaryCta={{ label: "Cross Life", href: "/products?type=CROSSLIFE" }}
      />
      {/* <ProductPageIntro product={selectedProduct} /> */}
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
            resolveProductType(selectedProduct.productType)
              ? `/products?type=${resolveProductType(selectedProduct.productType)}`
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
