"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { showAlert } from "@/components/ui/alert";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { addToCart } from "@/redux/slice/cartSlice";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [selectedWeight, setSelectedWeight] = useState(product.variants?.[0]?.weight ?? "");

  const primaryImage = product.images?.[0]?.url || "/kde-logo-1.png";
  const selectedVariant =
    product.variants.find((variant) => variant.weight === selectedWeight) || product.variants?.[0];

  const productId = product.id || product._id || product.slug;
  const price = selectedVariant?.price;
  const mrp = selectedVariant?.mrp;
  const hasDiscount = typeof mrp === "number" && typeof price === "number" && mrp > price;
  const discountAmount = hasDiscount ? mrp - price : 0;

  const savingsLabel = useMemo(() => {
    if (!hasDiscount || !mrp || !price) {
      return null;
    }

    return `${Math.round(((mrp - price) / mrp) * 100)}% OFF`;
  }, [hasDiscount, mrp, price]);

  const handleOpenProduct = () => {
    router.push(`/product/${product.slug}`);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      return;
    }

    if (!currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(pathname || `/product/${product.slug}`)}`);
      return;
    }

    dispatch(
      addToCart({
        cartItemId: `${productId}-${selectedVariant.weight}`,
        productId,
        slug: product.slug,
        name: product.name,
        image: primaryImage,
        category: product.category,
        variant: selectedVariant,
        quantity: 1,
      })
    );

    showAlert({
      type: "success",
      message: `${product.name} (${selectedVariant.weight}) added to cart.`,
    });
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <button
        type="button"
        onClick={handleOpenProduct}
        className="relative block aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.35),_transparent_45%),linear-gradient(135deg,_#fff7ed,_#ffffff_45%,_#fef3c7)] text-left"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent px-5 py-4 text-left">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/80">
            {product.category || "Premium spices"}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-white">{product.name}</h3>
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          {product.shortDescription || "Freshly packed premium spices for everyday cooking."}
        </p>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Select variant
            </span>
            <select
              value={selectedWeight}
              onChange={(event) => setSelectedWeight(event.target.value)}
              className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white"
            >
              {product.variants.map((variant) => (
                <option key={variant.weight} value={variant.weight}>
                  {variant.weight}
                </option>
              ))}
            </select>
          </label>

          {savingsLabel ? (
            <span className="inline-flex h-fit rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              {savingsLabel}
            </span>
          ) : null}
        </div>

        <div className="rounded-[24px] bg-slate-50 p-4">
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-orange-600">
                {typeof price === "number" ? `Rs. ${price}` : "Price unavailable"}
              </span>
              {typeof mrp === "number" ? (
                <span className="text-sm text-slate-400 line-through">Rs. {mrp}</span>
              ) : null}
            </div>

            {hasDiscount ? (
              <span className="text-sm font-semibold text-emerald-700">Save Rs. {discountAmount}</span>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {selectedVariant?.stock ? `${selectedVariant.stock} packs available` : "Fresh stock available"}
          </p>
        </div>

        <div className="mt-auto grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleOpenProduct}
            className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-full bg-[#7A330F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5f2609]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
