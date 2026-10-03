import {
  isCrossLineType,
  type ProductType,
} from "@/types/product";

export interface ProductTypeIntroStep {
  title: string;
  description: string;
}

export interface ProductTypeCatalog {
  label: string;
  heroTitle: string;
  heroImage: string;
  listingTitle: string;
  listingDescription: string;
  relatedTitle: string;
  relatedDescription: string;
  introBadge: string;
  introTitle: string;
  introDescription: string;
  introSteps: ProductTypeIntroStep[];
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
  CROSSLIFE: {
    label: "Cross Life",
    heroTitle: "Cross Life",
    heroImage: "/assets/productHero.webp",
    listingTitle: "Everyday spices, packed for real kitchens",
    listingDescription:
      "Explore authentic masalas, whole spices, and daily cooking essentials.",
    relatedTitle: "More flavours from the same collection",
    relatedDescription:
      "Explore related spices below and add the right pack size directly from the listing.",
    introBadge: "Cross Life",
    introTitle: "From farm-fresh spices to your kitchen",
    introDescription:
      "Every grocery product is selected for aroma, purity, and everyday cooking — so you know exactly what you are adding to your cart.",
    introSteps: [
      {
        title: "Trusted sourcing",
        description: "Spices and staples chosen for consistent kitchen quality.",
      },
      {
        title: "Clean packing",
        description: "Kitchen-ready packs that keep flavour locked in.",
      },
      {
        title: "Ready to cook",
        description: "Clear pack sizes and usage notes for daily meals.",
      },
    ],
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
  CROSSLINE: {
    label: "Cross Line",
    heroTitle: "Cross Line",
    heroImage: "/assets/electronicsHero.webp",
    listingTitle: "Cross Line — Agri Equipment",
    listingDescription:
      "Browse reliable electronics and equipment for everyday use.",
    relatedTitle: "More products from this range",
    relatedDescription: "Explore more products from the same category.",
    introBadge: "Cross Line",
    introTitle: "Built for everyday reliability",
    introDescription:
      "Explore clear specifications, practical variants, and dependable equipment chosen for home and work use — without the spice-aisle look.",
    introSteps: [
      {
        title: "Clear specs",
        description: "Key details upfront so you can compare with confidence.",
      },
      {
        title: "Quality build",
        description: "Practical equipment designed for regular use.",
      },
      {
        title: "Ready to order",
        description: "Pick a variant and add to cart in a few taps.",
      },
    ],
    variantLabel: "Choose variant",
    stockInStock: "{count} units in stock",
    stockFallback: "Available while stock lasts",
    categoryFallback: "Cross Line",
    highlightTitle: "Key features",
    benefitsTitle: "What you get",
    defaultUsage: "Follow the included guidelines for safe and proper use.",
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
    "Browse Cross Life foods and Cross Line equipment with dedicated filters, categories, and pack or variant options.",
};

export const getProductTypeCatalog = (
  productType?: string | null,
): ProductTypeCatalog =>
  isCrossLineType(productType) ? CATALOG.CROSSLINE : CATALOG.CROSSLIFE;

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
