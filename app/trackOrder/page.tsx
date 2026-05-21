import type { Metadata } from "next";

import { buildMetadata } from "@/app/seo";
import TrackOrderPageClient from "./TrackOrderPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Track Your Order",
  description:
    "Track your Kaka Dikro order status, delivery progress, and shipping updates from one convenient page.",
  path: "/trackOrder",
  keywords: ["track order", "order status", "Kaka Dikro delivery tracking"],
  index: false,
});

export default function Page() {
  return <TrackOrderPageClient />;
}
