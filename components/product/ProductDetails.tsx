"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Leaf, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import ProductImageGallery from "@/components/product/ProductImageGallery";
import { showAlert } from "@/components/ui/alert";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { getApiErrorMessage } from "@/lib/apiError";
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
import { isCrossLineType, type Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
}

const cleanList = (items?: string[] | null) =>
  (items || []).map((item) => String(item).trim()).filter(Boolean);

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const catalog = getProductTypeCatalog(product.productType);
  const isElectronics = isCrossLineType(product.productType);
  const isGrocery = !isElectronics;

  const [selectedKey, setSelectedKey] = useState(
    getVariantKey(product.variants?.[0]) || "",
  );

  const selectedVariant =
    findVariantByKey(product.variants, selectedKey) || product.variants?.[0];
  const selectedVariantKey = getVariantKey(selectedVariant);
  const price = selectedVariant?.price;
  const mrp = selectedVariant?.mrp;
  const hasDiscount =
    typeof mrp === "number" && typeof price === "number" && mrp > price;
  const productId = String(product.id || product._id || "").trim();
  const isOutOfStock =
    typeof selectedVariant?.stock === "number" && selectedVariant.stock <= 0;
  const stockLabel = formatStockLabel(
    product.productType,
    selectedVariant?.stock,
    isOutOfStock,
  );

  const ingredients = useMemo(
    () => cleanList(product.ingredients),
    [product.ingredients],
  );
  const features = useMemo(
    () => cleanList(product.features),
    [product.features],
  );
  const benefits = useMemo(
    () => cleanList(product.benefits),
    [product.benefits],
  );
  const tags = useMemo(() => cleanList(product.tags), [product.tags]);
  const usage = product.usage?.trim() || "";

  const specifications = useMemo(() => {
    if (!product.specifications || typeof product.specifications !== "object") {
      return [];
    }
    return Object.entries(product.specifications).filter(
      ([key, value]) => key && value != null && String(value).trim() !== "",
    );
  }, [product.specifications]);

  const hasVariants = (product.variants || []).length > 0;
  const showIngredients = isGrocery && ingredients.length > 0;
  // Specs are primary for electronics; still show for grocery when present
  const showAnySpecifications =
    specifications.length > 0 && (isElectronics || isGrocery);
  const showFeatures = features.length > 0;
  const showBenefits = benefits.length > 0;
  const showUsage = Boolean(usage);
  const showTags = tags.length > 0;

  const handleExpiredImage = () => {
    if (!product.slug) {
      return;
    }

    void getProductBySlug(product.slug)
      .then((fresh) => {
        dispatch(upsertProduct(fresh));
      })
      .catch(() => undefined);
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
      router.push(
        `/login?redirect=${encodeURIComponent(pathname || `/products/${product.slug}`)}`,
      );
      return;
    }

    void dispatch(
      addCartItem({
        productId,
        weight: selectedVariantKey,
        quantity: 1,
      }),
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
        const message = getApiErrorMessage(
          error,
          "Failed to add item to cart.",
        );

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
    <section>
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-14">
        <div className="space-y-5">
          <ProductImageGallery
            images={product.images}
            video={product.video}
            productName={product.name}
            onExpired={handleExpiredImage}
          />

          {showBenefits ? (
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                <Sparkles className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {catalog.benefitsTitle}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {benefits.join(" • ")}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-lg shadow-orange-100/30 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {formatProductTypeLabel(product.productType)}
              </span>
              {product.category ? (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                  {product.category}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {product.name}
            </h1>

            {product.shortDescription?.trim() ? (
              <p className="mt-3 text-base font-medium leading-7 text-slate-700 sm:text-lg">
                {product.shortDescription.trim()}
              </p>
            ) : null}

            {product.description?.trim() &&
            product.description.trim() !== product.shortDescription?.trim() ? (
              <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                {product.description.trim()}
              </p>
            ) : !product.shortDescription?.trim() && product.description?.trim() ? (
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                {product.description.trim()}
              </p>
            ) : null}

            {showTags ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-6 rounded-[24px] bg-slate-50 p-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-orange-600 sm:text-3xl">
                    {typeof price === "number" ? (
                      <>&#8377; {price}</>
                    ) : (
                      "Price unavailable"
                    )}
                  </span>
                  {typeof mrp === "number" ? (
                    <span className="text-base text-slate-400 line-through">
                      &#8377; {mrp}
                    </span>
                  ) : null}
                </div>
                {hasDiscount ? (
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:text-sm">
                    Save &#8377; {mrp! - price!}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                {hasVariants ? (
                  <label className="space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {catalog.variantLabel}
                    </span>
                    <select
                      value={selectedKey}
                      onChange={(event) => setSelectedKey(event.target.value)}
                      className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-orange-400"
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
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || !hasVariants}
                  aria-disabled={isOutOfStock || !hasVariants}
                  className="rounded-full bg-[#7A330F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f2609] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                >
                  Add to Cart
                </button>
              </div>

              <p
                className={`mt-2 text-xs sm:text-sm ${
                  isOutOfStock
                    ? "font-semibold text-red-600"
                    : "text-slate-500"
                }`}
              >
                {stockLabel}
              </p>
            </div>
          </div>

          {showIngredients ? (
            <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Ingredients
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {ingredients.map((ingredient) => (
                  <li
                    key={ingredient}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {showAnySpecifications ? (
            <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Specifications
              </h2>
              <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100">
                {specifications.map(([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-2 gap-3 px-4 py-3 text-sm"
                  >
                    <span className="text-slate-500">{key}</span>
                    <span className="font-medium text-slate-800">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {showUsage || showFeatures ? (
            <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
              {showUsage ? (
                <div className={showFeatures ? "" : "sm:col-span-2"}>
                  <h2 className="text-base font-semibold text-slate-900">
                    Usage
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {usage}
                  </p>
                </div>
              ) : null}

              {showFeatures ? (
                <div className={showUsage ? "" : "sm:col-span-2"}>
                  <h2 className="text-base font-semibold text-slate-900">
                    Features
                  </h2>
                  <div className="mt-3 space-y-2.5">
                    {features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 text-sm text-slate-600"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
