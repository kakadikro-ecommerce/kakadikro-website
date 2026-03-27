import type { Metadata } from "next";

import { buildMetadata } from "@/app/seo";
import ContactUsPageClient from "./ContactUsPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Contact Kaka Dikro",
  description:
    "Get in touch with Kaka Dikro for product questions, order support, wholesale inquiries, and customer assistance.",
  path: "/contactUs",
  keywords: ["contact Kaka Dikro", "masala support", "spice order help"],
});

export default function Page() {
  return <ContactUsPageClient />;
}
