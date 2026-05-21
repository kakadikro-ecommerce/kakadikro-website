import type { Metadata } from "next";

const siteName = "Kaka Dikro";
const defaultTitle = "Kaka Dikro | Authentic Gujarati Masala & Spices";
const defaultDescription =
  "Discover authentic Gujarati masala, blended spices, and handcrafted flavors from Kaka Dikro.";

export const siteConfig = {
  siteName,
  defaultTitle,
  defaultDescription,
  baseUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://www.kakadikro.com",
  defaultOgImage: "/assets/favicon_io/android-chrome-512x512.png",
};

export function buildMetadata({
  title,
  description = defaultDescription,
  path = "/",
  keywords,
  image = siteConfig.defaultOgImage,
  index = true,
}: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string;
  index?: boolean;
}): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName,
      type: "website",
      images: [
        {
          url: image,
          alt: `${siteName} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index,
      follow: index,
      googleBot: {
        index,
        follow: index,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
