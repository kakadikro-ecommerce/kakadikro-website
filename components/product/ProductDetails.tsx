"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { showAlert } from "@/components/ui/alert";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { addToCart } from "@/redux/slice/cartSlice";
import type { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [selectedWeight, setSelectedWeight] = useState(product.variants?.[0]?.weight ?? "");

  const selectedVariant =
    product.variants.find((variant) => variant.weight === selectedWeight) || product.variants?.[0];
  const primaryImage = product.images?.[0]?.url || "/kde-logo-1.png";
  const price = selectedVariant?.price;
  const mrp = selectedVariant?.mrp;
  const hasDiscount = typeof mrp === "number" && typeof price === "number" && mrp > price;
  const productId = product.id || product._id || product.slug;

  const highlightCards = useMemo(
    () => [
      {
        title: "Clean ingredients",
        description:
          product.ingredients?.join(", ") || "Thoughtfully sourced spice ingredients for everyday cooking.",
        icon: Leaf,
      },
      {
        title: "Why people choose it",
        description:
          product.features?.join(" • ") || "Fresh aroma, rich flavour, and reliable quality in every pack.",
        icon: ShieldCheck,
      },
      {
        title: "Kitchen benefits",
        description:
          product.benefits?.join(" • ") || "Built to add aroma, colour, and depth to your recipes.",
        icon: Sparkles,
      },
    ],
    [product.benefits, product.features, product.ingredients]
  );

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
    <section className="bg-[linear-gradient(180deg,_#fff7ed_0%,_#ffffff_55%,_#fffaf5_100%)]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[32px] border border-orange-100 bg-white shadow-xl shadow-orange-100/60">
            <div className="relative aspect-[5/4] bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.38),_transparent_42%),linear-gradient(135deg,_#ffedd5,_#ffffff_40%,_#fef3c7)]">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {highlightCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm"
                >
                  <Icon className="h-5 w-5 text-orange-600" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-orange-100 bg-white p-6 shadow-xl shadow-orange-100/40 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              {product.category ? (
                <span className="rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-700">
                  {product.category}
                </span>
              ) : null}
              {product.brand ? (
                <span className="rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-600">
                  {product.brand}
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-4 text-base leading-8 text-slate-600">
              {product.description || product.shortDescription}
            </p>

            <div className="mt-8 rounded-[28px] bg-slate-50 p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-orange-600">
                    {typeof price === "number" ? `Rs. ${price}` : "Price unavailable"}
                  </span>
                  {typeof mrp === "number" ? (
                    <span className="text-lg text-slate-400 line-through">Rs. {mrp}</span>
                  ) : null}
                </div>
                {hasDiscount ? (
                  <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                    Save Rs. {mrp! - price!}
                  </span>
                ) : null}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <label className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Choose pack size
                  </span>
                  <select
                    value={selectedWeight}
                    onChange={(event) => setSelectedWeight(event.target.value)}
                    className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-orange-400"
                  >
                    {product.variants.map((variant) => (
                      <option key={variant.weight} value={variant.weight}>
                        {variant.weight}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="rounded-full bg-[#7A330F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5f2609]"
                >
                  Add to Cart
                </button>
              </div>

              <p className="mt-3 text-sm text-slate-500">
                {selectedVariant?.stock
                  ? `${selectedVariant.stock} packs currently in stock`
                  : "Available while fresh stock lasts"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 rounded-[32px] border border-orange-100 bg-white p-6 shadow-sm sm:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Usage</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {product.usage || "Perfect for curries, marinades, tempering, and everyday home cooking."}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">Product highlights</h2>
              <div className="mt-3 space-y-3">
                {(product.features?.length ? product.features : ["Fresh aroma", "Kitchen-ready packing", "Premium spice quality"]).map(
                  (feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{feature}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
