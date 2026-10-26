"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface HeroProps {
  image?: string;
  alt?: string;
  fallbackImage?: string;
}

const DEFAULT_FALLBACK = "/assets/banner.webp";
const DEFAULT_SIZE = { width: 1920, height: 654 };

export default function HeroSection({
  image,
  alt = "",
  fallbackImage = DEFAULT_FALLBACK,
}: HeroProps) {
  const preferred = image || fallbackImage;
  const [src, setSrc] = useState(preferred);

  useEffect(() => {
    setSrc(preferred || fallbackImage);
  }, [preferred, fallbackImage]);

  return (
    <section className="relative w-full overflow-hidden bg-[#f3eee6]">
      <div className="relative w-full" style={{ aspectRatio: "1920 / 654" }}>
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          unoptimized
          className="object-cover object-center"
          onError={() => {
            if (src !== fallbackImage) {
              setSrc(fallbackImage);
            }
          }}
        />
      </div>
      {/* Keep intrinsic size hint for older layout engines */}
      <span className="sr-only">{`${DEFAULT_SIZE.width}x${DEFAULT_SIZE.height}`}</span>
    </section>
  );
}
