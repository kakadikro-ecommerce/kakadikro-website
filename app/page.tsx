import type { Metadata } from "next";

import HomePageClient from "./HomePageClient";
import { buildMetadata } from "./seo";

export const metadata: Metadata = buildMetadata({
  title: "Authentic Gujarati Masala & Spices",
  description:
    "Shop handcrafted Gujarati masala blends, whole spices, and flavorful pantry essentials from Kaka Dikro.",
  path: "/",
  keywords: [
    "Gujarati masala",
    "authentic Indian spices",
    "Kaka Dikro spices",
    "masala online store",
  ],
});

export default function Page() {
  return <HomePageClient />;
}
