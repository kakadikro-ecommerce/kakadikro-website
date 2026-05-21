import type { Metadata } from "next";

import { buildMetadata } from "@/app/seo";
import ProductsPageClient from "./ProductsPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Shop Our Masala Collection",
  description:
    "Browse the complete Kaka Dikro spice collection, including whole spices, blended masalas, and daily cooking essentials.",
  path: "/products",
  keywords: ["buy masala online", "Gujarati spices", "whole spices", "blended masala"],
});

export default function ProductsPage() {
  return <ProductsPageClient />;
}
