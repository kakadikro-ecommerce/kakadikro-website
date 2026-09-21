import type { ProductType, ProductVariant } from "@/types/product";

/**
 * Resolves the display label / cart key for a variant.
 * Prefer name, then legacy weight, then attributes.weight.
 * Cart API still expects this value in the `weight` field.
 */
export const getVariantKey = (variant?: ProductVariant | null): string => {
  if (!variant) return "";

  const fromName = typeof variant.name === "string" ? variant.name.trim() : "";
  if (fromName) return fromName;

  const fromWeight =
    typeof variant.weight === "string" ? variant.weight.trim() : "";
  if (fromWeight) return fromWeight;

  const attributes = variant.attributes;
  if (attributes && typeof attributes === "object") {
    const weightAttr =
      typeof attributes.weight === "string" ? attributes.weight.trim() : "";
    if (weightAttr) return weightAttr;
  }

  return "";
};

export const findVariantByKey = (
  variants: ProductVariant[] | undefined,
  key: string,
): ProductVariant | undefined => {
  if (!Array.isArray(variants) || !key) return undefined;
  return variants.find((variant) => getVariantKey(variant) === key);
};

export const formatProductTypeLabel = (
  productType?: string | null,
): string => {
  const normalized = String(productType || "GROCERY").trim().toUpperCase();
  if (normalized === "ELECTRONICS") return "Electronics";
  return "Grocery";
};

export const PRODUCT_TYPE_OPTIONS: Array<{
  value: "" | ProductType;
  label: string;
}> = [
  { value: "", label: "All Products" },
  { value: "GROCERY", label: "Grocery" },
  { value: "ELECTRONICS", label: "Electronics" },
];
