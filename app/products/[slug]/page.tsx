import type { Metadata } from "next";

import ProductPageClient from "./ProductPageClient";
import { buildMetadata } from "@/app/seo";
import { getProductBySlug } from "@/redux/api/productApi";

function formatSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fallbackTitle = formatSlug(slug);

  try {
    const product = await getProductBySlug(slug);

    return buildMetadata({
      title: product.name,
      description:
        product.shortDescription ||
        product.description ||
        `Explore ${product.name} from Kaka Dikro's authentic masala collection.`,
      path: `/products/${slug}`,
      keywords: [product.name, product.category, product.brand, ...(product.tags || [])].filter(
        Boolean
      ) as string[],
      image: product.images?.[0]?.url || undefined,
    });
  } catch {
    return buildMetadata({
      title: fallbackTitle,
      description: `Explore ${fallbackTitle} from Kaka Dikro's authentic masala collection.`,
      path: `/products/${slug}`,
    });
  }
}

export default function ProductPage() {
  return <ProductPageClient />;
}
