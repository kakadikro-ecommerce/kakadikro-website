import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ReduxProvider from "@/redux/provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { siteConfig } from "@/app/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.defaultDescription,
  applicationName: siteConfig.siteName,
  referrer: "origin-when-cross-origin",
  keywords: [
    "Kaka Dikro",
    "Gujarati masala",
    "Indian spices",
    "blended spices",
    "whole spices",
    "masala online",
  ],
  authors: [{ name: siteConfig.siteName }],
  creator: siteConfig.siteName,
  publisher: siteConfig.siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    url: "/",
    siteName: siteConfig.siteName,
    type: "website",
    images: [
      {
        url: siteConfig.defaultOgImage,
        alt: `${siteConfig.siteName} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: [siteConfig.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/assets/favicon_io/favicon.ico" },
      { url: "/assets/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/assets/favicon_io/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/assets/favicon_io/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alan+Sans:wght@300..900&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Sekuya&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-100 min-h-screen flex flex-col" suppressHydrationWarning>
        <ReduxProvider>
          <ToastContainer position="top-right" autoClose={2500} theme="light" />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
