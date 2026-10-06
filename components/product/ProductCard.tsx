"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { showAlert } from "@/components/ui/alert";
import CatalogImage from "@/components/ui/CatalogImage";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { getApiErrorMessage } from "@/lib/apiError";
import {
  formatStockLabel,
  getProductTypeCatalog,
} from "@/lib/productTypeCatalog";
import {
  findVariantByKey,
  getVariantKey,
} from "@/lib/variantLabel";
import { getProductBySlug } from "@/redux/api/productApi";
import { addCartItem, openCart } from "@/redux/slice/cartSlice";
import { upsertProduct } from "@/redux/slice/productSlice";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  className?: string;
}

function getBadge(product: Product): { label: string; tone: "orange" | "teal" } | null {
  const tags = (product.tags || []).map((tag) => tag.toLowerCase());

  if (tags.some((tag) => tag.includes("trending"))) {
    return { label: "Trending", tone: "orange" };
  }
  if (tags.some((tag) => tag.includes("new"))) {
    return { label: "New Launch", tone: "teal" };
  }
  if (tags.some((tag) => tag.includes("best") || tag.includes("seller"))) {
    return { label: "Best Seller", tone: "teal" };
  }
  if (product.isFeatured) {
    return { label: "Best Seller", tone: "teal" };
  }
  if (product.productType === "CROSSLIFE") {
    return { label: "Trending", tone: "orange" };
  }
  if (product.productType === "CROSSLINE") {
    return { label: "New Launch", tone: "teal" };
  }
  return null;
}

function stripHtml(value?: string) {
  if (!value) return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const catalog = getProductTypeCatalog(product.productType);
  const [selectedKey, setSelectedKey] = useState(
    getVariantKey(product.variants?.[0]) || "",
  );
  const imageUrls = useMemo(
    () => (product.images || []).map((image) => image?.url).filter(Boolean) as string[],
    [product.images],
  );
  const primaryImage = imageUrls[0];
  const hoverImage = imageUrls.length > 1 ? imageUrls[1] : null;
  const [imageSrc, setImageSrc] = useState(primaryImage);
  const [isImageHovered, setIsImageHovered] = useState(false);

  useEffect(() => {
    setImageSrc(primaryImage);
    setIsImageHovered(false);
  }, [primaryImage, product.slug]);

  const displayImageSrc =
    isImageHovered && hoverImage ? hoverImage : imageSrc || primaryImage;

  const selectedVariant =
    findVariantByKey(product.variants, selectedKey) || product.variants?.[0];
  const selectedVariantKey = getVariantKey(selectedVariant);

  const productId = String(product.id || product._id || "").trim();
  const price = selectedVariant?.price;
  const mrp = selectedVariant?.mrp;
  const hasDiscount = typeof mrp === "number" && typeof price === "number" && mrp > price;
  const isOutOfStock = typeof selectedVariant?.stock === "number" && selectedVariant.stock <= 0;
  const stockLabel = formatStockLabel(
    product.productType,
    selectedVariant?.stock,
    isOutOfStock,
  );

  const badge = useMemo(() => getBadge(product), [product]);
  const hasRating = typeof product.rating === "number" && product.rating > 0;
  const rating = hasRating ? product.rating! : 0;
  const shortCopy = useMemo(() => {
    const raw =
      product.shortDescription ||
      stripHtml(product.description) ||
      product.category ||
      catalog.categoryFallback ||
      "";
    return raw.length > 56 ? `${raw.slice(0, 56).trim()}…` : raw;
  }, [product.shortDescription, product.description, product.category, catalog.categoryFallback]);

  const handleExpiredImage = () => {
    if (!product.slug) {
      return;
    }

    void getProductBySlug(product.slug)
      .then((fresh) => {
        dispatch(upsertProduct(fresh));
        setImageSrc(fresh.images?.[0]?.url);
      })
      .catch(() => undefined);
  };

  const handleOpenProduct = () => {
    router.push(`/products/${product.slug}`);
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedVariantKey) {
      return;
    }

    if (!productId) {
      showAlert({
        type: "error",
        message: "This product is missing an id. Please refresh and try again.",
      });
      return;
    }

    if (isOutOfStock) {
      return;
    }

    if (!currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(pathname || `/products/${product.slug}`)}`);
      return;
    }

    void dispatch(
      addCartItem({
        productId,
        weight: selectedVariantKey,
        quantity: 1,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(openCart());
        showAlert({
          type: "success",
          message: `${product.name} (${selectedVariantKey}) added to cart.`,
        });
      })
      .catch((error: unknown) => {
        const message = getApiErrorMessage(error, "Failed to add item to cart.");

        if (message.toLowerCase().includes("out of stock")) {
          return;
        }

        showAlert({
          type: "error",
          message,
        });
      });
  };

  return (
    <article
      className={`group flex h-full w-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] ${className}`}
    >
      <button
        type="button"
        onClick={handleOpenProduct}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        onFocus={() => setIsImageHovered(true)}
        onBlur={() => setIsImageHovered(false)}
        className="relative block aspect-[5/4] w-full overflow-hidden bg-[#f3f1ec] text-left"
      >
        <CatalogImage
          src={displayImageSrc}
          fallback="/kde-logo.png"
          alt={product.images?.[0]?.altText || product.name}
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1200px) 45vw, 25vw"
          className={`object-cover transition-all duration-500 ${
            hoverImage && isImageHovered ? "scale-105" : "group-hover:scale-105"
          }`}
          onExpired={handleExpiredImage}
        />

        {hoverImage ? (
          <span className="pointer-events-none absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className={`h-1.5 w-1.5 rounded-full ${isImageHovered ? "bg-white/50" : "bg-white"}`} />
            <span className={`h-1.5 w-1.5 rounded-full ${isImageHovered ? "bg-white" : "bg-white/50"}`} />
          </span>
        ) : null}

        {badge ? (
          <span
            className={`absolute right-0 top-0 z-10 inline-flex items-center rounded-bl-lg px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white sm:text-[11px] ${
              badge.tone === "orange" ? "bg-[#e07a2f]" : "bg-[#003d4d]"
            }`}
          >
            {badge.label}
          </span>
        ) : null}

        {hasDiscount && typeof mrp === "number" && typeof price === "number" ? (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold text-emerald-700 shadow-sm sm:text-[11px]">
            {Math.round(((mrp - price) / mrp) * 100)}% OFF
          </span>
        ) : null}
      </button>

      <div className="flex flex-1 flex-col px-4 pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={handleOpenProduct}
            className="line-clamp-1 text-left text-[15px] font-bold text-[#003d4d] transition hover:opacity-80 sm:text-base"
          >
            {product.name}
          </button>
          <span className="shrink-0 text-[15px] font-bold text-slate-900 sm:text-base">
            {typeof price === "number" ? <>&#8377;{price.toLocaleString("en-IN")}</> : "—"}
          </span>
        </div>

        {shortCopy ? (
          <p className="mt-1 line-clamp-1 text-xs text-slate-500 sm:text-[13px]">
            {shortCopy}
          </p>
        ) : null}

        {hasRating ? (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-0.5 text-amber-400" aria-hidden>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={13}
                  className={index < Math.round(rating) ? "fill-current" : "fill-none text-slate-300"}
                />
              ))}
            </div>
            <span className="tabular-nums">{rating.toFixed(2)}</span>
          </div>
        ) : null}

        {typeof mrp === "number" && hasDiscount ? (
          <p className="mt-1 text-xs text-slate-400 line-through">
            &#8377;{mrp.toLocaleString("en-IN")}
          </p>
        ) : null}

        {isOutOfStock ? (
          <p className="mt-1 text-[11px] font-semibold text-red-600">{stockLabel}</p>
        ) : null}

        <div className="mt-auto px-0 pb-3 pt-3">
          <label className="block">
            <span className="sr-only">Select variant</span>
            <select
              value={selectedKey}
              onChange={(event) => setSelectedKey(event.target.value)}
              className="w-full appearance-none rounded-md border border-gray-400 bg-white bg-[length:12px] bg-[right_12px_center] bg-no-repeat px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#003d4d] focus:ring-2 focus:ring-[#003d4d]/15"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
              }}
            >
              {product.variants.map((variant, index) => {
                const key = getVariantKey(variant) || `variant-${index}`;
                return (
                  <option key={key} value={getVariantKey(variant)}>
                    {getVariantKey(variant) || "Variant"}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      </div>

      {/* Full-bleed bottom CTA — no side padding */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        aria-disabled={isOutOfStock}
        className="w-full rounded-none bg-[#003d4d] px-3 py-3.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#025366] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 sm:text-sm"
      >
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
    </article>
  );
}
