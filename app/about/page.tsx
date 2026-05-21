import type { Metadata } from "next";

import AboutPageClient from "./AboutPageClient";
import { buildMetadata } from "@/app/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Kaka Dikro",
  description:
    "Learn more about Kaka Dikro, our story, and the passion behind our authentic Gujarati masala and spice collection.",
  path: "/about",
  keywords: ["about Kaka Dikro", "Gujarati spice brand", "Indian masala company"],
});

export default function Page() {
  return <AboutPageClient />;
}
