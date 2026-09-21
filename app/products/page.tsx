import type { Metadata } from "next";
import { Suspense } from "react";

import { buildMetadata } from "@/app/seo";
import ProductsPageClient from "./ProductsPageClient";
import Loader from "@/components/ui/Loader";

export const metadata: Metadata = buildMetadata({
  title: "Shop Our Products",
  description:
    "Browse Kaka Dikro grocery spices and electronics including pumps, torches, and daily essentials.",
  path: "/products",
  keywords: ["buy masala online", "Gujarati spices", "electronics", "water pump"],
});

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl px-4 py-16">
          <Loader label="Loading products" size="lg" />
        </div>
      }
    >
      <ProductsPageClient />
    </Suspense>
  );
}
