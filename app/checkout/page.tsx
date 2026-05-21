import type { Metadata } from "next";

import CheckoutClient from "@/components/checkout/CheckoutClient";
import { buildMetadata } from "@/app/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout",
  description: "Complete your Kaka Dikro purchase securely and review your order before payment.",
  path: "/checkout",
  index: false,
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
