"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";

import {
  DEFAULT_PRODUCT_FALLBACK,
  normalizeImageSrc,
  shouldBypassImageOptimization,
} from "@/lib/image";

type CatalogImageProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
  fallback?: string;
  onExpired?: () => void;
};

export default function CatalogImage({
  src,
  fallback = DEFAULT_PRODUCT_FALLBACK,
  onExpired,
  alt,
  ...props
}: CatalogImageProps) {
  const [failed, setFailed] = useState(false);
  const retriedSrc = useRef<string | null>(null);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const resolved = failed ? fallback : normalizeImageSrc(src, fallback);

  return (
    <Image
      {...props}
      src={resolved}
      alt={alt}
      unoptimized={shouldBypassImageOptimization(resolved)}
      onError={() => {
        if (!failed) {
          setFailed(true);
        }

        if (!src || retriedSrc.current === src) {
          return;
        }

        retriedSrc.current = src;
        onExpired?.();
      }}
    />
  );
}
