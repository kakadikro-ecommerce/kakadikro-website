"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, ShoppingCart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { showAlert } from "@/components/ui/alert";
import CatalogImage from "@/components/ui/CatalogImage";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  formatStockLabel,
  getProductTypeCatalog,
} from "@/lib/productTypeCatalog";
import {
  findVariantByKey,
  formatProductTypeLabel,
  getVariantKey,
} from "@/lib/variantLabel";
import { getProductBySlug } from "@/redux/api/productApi";
import { addCartItem, openCart } from "@/redux/slice/cartSlice";
import { upsertProduct } from "@/redux/slice/productSlice";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const catalog = getProductTypeCatalog(product.productType);
  const [selectedKey, setSelectedKey] = useState(
    getVariantKey(product.variants?.[0]) || "",
  );
  const [imageSrc, setImageSrc] = useState(product.images?.[0]?.url);

  useEffect(() => {
    setImageSrc(product.images?.[0]?.url);
  }, [product.images, product.slug]);

  const selectedVariant =
    findVariantByKey(product.variants, selectedKey) || product.variants?.[0];
  const selectedVariantKey = getVariantKey(selectedVariant);

  const productId = product.id || product._id || product.slug;
  const price = selectedVariant?.price;
  const mrp = selectedVariant?.mrp;
  const hasDiscount = typeof mrp === "number" && typeof price === "number" && mrp > price;
  const discountAmount = hasDiscount ? mrp - price : 0;
  const isOutOfStock = typeof selectedVariant?.stock === "number" && selectedVariant.stock <= 0;
  const stockLabel = formatStockLabel(
    product.productType,
    selectedVariant?.stock,
    isOutOfStock,
  );

  const savingsLabel = useMemo(() => {
    if (!hasDiscount || !mrp || !price) {
      return null;
    }

    return `${Math.round(((mrp - price) / mrp) * 100)}% OFF`;
  }, [hasDiscount, mrp, price]);

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
      .catch((error: string) => {
        if (error?.toLowerCase().includes("out of stock")) {
          return;
        }

        showAlert({
          type: "error",
          message: error || "Failed to add item to cart.",
        });
      });
  };

  return (
    <article className="group flex h-full max-w-[320px] flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:shadow-lg sm:max-w-none">
      <button
        type="button"
        onClick={handleOpenProduct}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.35),_transparent_45%),linear-gradient(135deg,_#fff7ed,_#ffffff_45%,_#fef3c7)] text-left"
      >
        <CatalogImage
          src={imageSrc}
          fallback="/kde-logo.png"
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
          onExpired={handleExpiredImage}
        />
        <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/10" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-3 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/80">
              {product.category || catalog.categoryFallback}
            </p>
            {product.productType ? (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                {formatProductTypeLabel(product.productType)}
              </span>
            ) : null}
          </div>
          <h3 className="mt-1 line-clamp-1 text-base font-semibold text-white sm:text-lg">
            {product.name}
          </h3>
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <div className="grid gap-2">
          <label className="space-y-2">
            <select
              value={selectedKey}
              onChange={(event) => setSelectedKey(event.target.value)}
              className="w-full rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white sm:text-sm"
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

          {savingsLabel ? <span className="text-[11px] font-semibold text-emerald-700">{savingsLabel}</span> : null}
        </div>

        <div className="p-1">
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-bold text-orange-600 sm:text-lg">
                {typeof price === "number" ? <>&#8377; {price}</> : "Price unavailable"}
              </span>
              {typeof mrp === "number" ? (
                <span className="text-[11px] text-slate-400 line-through sm:text-xs">&#8377; {mrp}</span>
              ) : null}
            </div>

            {hasDiscount ? (
              <span className="text-[11px] font-semibold text-emerald-700">
                Save &#8377; {discountAmount}
              </span>
            ) : null}
          </div>
          <p className={`mt-1 text-[11px] ${isOutOfStock ? "font-semibold text-red-600" : "text-slate-500"}`}>
            {stockLabel}
          </p>
        </div>

        <div className="mt-auto grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleOpenProduct}
            className="flex items-center justify-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600 sm:text-xs"
          >
            <Eye size={16} />
            <span className="hidden sm:inline">View</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-disabled={isOutOfStock}
            className="flex items-center justify-center gap-1.5 rounded-full bg-[#7A330F] px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#5f2609] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 sm:text-xs"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
