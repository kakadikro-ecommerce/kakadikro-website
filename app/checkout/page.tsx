import type { Metadata } from "next";
import { Suspense } from "react";

import CheckoutClient from "@/components/checkout/CheckoutClient";
import { buildMetadata } from "@/app/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout",
  description: "Complete your Kaka Dikro purchase securely and review your order before payment.",
  path: "/checkout",
  index: false,
});

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-[linear-gradient(180deg,_#fff7ed_0%,_#ffffff_28%,_#f8fafc_100%)]">
          <div className="mx-auto flex w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-sm text-slate-500">Loading checkout...</p>
          </div>
        </section>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
