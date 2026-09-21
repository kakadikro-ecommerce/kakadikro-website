import type { ProductType } from "@/types/product";

export interface ProductTypeCatalog {
  label: string;
  listingTitle: string;
  listingDescription: string;
  relatedTitle: string;
  relatedDescription: string;
  variantLabel: string;
  stockInStock: string;
  stockFallback: string;
  categoryFallback: string;
  highlightTitle: string;
  benefitsTitle: string;
  defaultUsage: string;
  defaultFeatures: string[];
  showIngredients: boolean;
}

const CATALOG: Record<ProductType, ProductTypeCatalog> = {
  GROCERY: {
    label: "Grocery",
    listingTitle: "Everyday spices, packed for real kitchens",
    listingDescription:
      "Explore authentic masalas, whole spices, and daily cooking essentials.",
    relatedTitle: "More flavours from the same collection",
    relatedDescription:
      "Explore related spices below and add the right pack size directly from the listing.",
    variantLabel: "Choose pack size",
    stockInStock: "{count} packs available",
    stockFallback: "Available while fresh stock lasts",
    categoryFallback: "Premium spices",
    highlightTitle: "Clean ingredients",
    benefitsTitle: "Kitchen benefits",
    defaultUsage:
      "Perfect for curries, marinades, tempering, and everyday home cooking.",
    defaultFeatures: ["Fresh aroma", "Kitchen-ready packing", "Premium spice quality"],
    showIngredients: true,
  },
  ELECTRONICS: {
    label: "Electronics",

    listingTitle: "Electronics & Equipment",
    listingDescription:
      "Browse reliable electronics and equipment for everyday use.",

    relatedTitle: "More products from this range",
    relatedDescription:
      "Explore more products from the same category.",

    variantLabel: "Choose variant",

    stockInStock: "{count} units in stock",
    stockFallback: "Available while stock lasts",

    categoryFallback: "Electronics",

    highlightTitle: "Key features",
    benefitsTitle: "What you get",

    defaultUsage:
      "Follow the included guidelines for safe and proper use.",

    defaultFeatures: [
      "Reliable performance",
      "Quality build",
      "Designed for everyday use",
    ],

    showIngredients: false,
  },
};

const ALL_PRODUCTS_CATALOG: Pick<
  ProductTypeCatalog,
  "listingTitle" | "listingDescription"
> = {
  listingTitle: "Explore our complete product collection",
  listingDescription:
    "Browse grocery and electronics with dedicated filters, categories, and pack or variant options.",
};

export const getProductTypeCatalog = (
  productType?: string | null,
): ProductTypeCatalog => {
  const normalized = String(productType || "GROCERY").trim().toUpperCase();
  if (normalized === "ELECTRONICS") {
    return CATALOG.ELECTRONICS;
  }
  return CATALOG.GROCERY;
};

export const getAllProductsCatalog = () => ALL_PRODUCTS_CATALOG;

export const formatStockLabel = (
  productType: string | null | undefined,
  stock: number | undefined,
  isOutOfStock: boolean,
) => {
  const catalog = getProductTypeCatalog(productType);

  if (isOutOfStock) {
    return "Item is out of stock";
  }

  if (typeof stock === "number") {
    return catalog.stockInStock.replace("{count}", String(stock));
  }

  return catalog.stockFallback;
};
