"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  getActiveHeroBanners,
  getHeroBannerFallback,
} from "@/redux/api/heroBannerApi";
import { preloadImage } from "@/lib/preloadImage";

type Slide = {
  id: string;
  url: string;
  alt: string;
};

const FALLBACK_SLIDES: Slide[] = [
  {
    id: "fallback-home",
    url: getHeroBannerFallback("HOME"),
    alt: "Kaka Dikro",
  },
];

const AUTO_MS = 5000;

export default function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>(FALLBACK_SLIDES);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const banners = await getActiveHeroBanners("HOME");
        const candidates = banners
          .filter((banner) => banner.image?.url)
          .slice(0, 4)
          .map((banner) => ({
            id: banner.id,
            url: banner.image!.url,
            alt: banner.image?.altText || "Kaka Dikro",
          }));

        if (candidates.length === 0) {
          return;
        }

        const ready: Slide[] = [];
        for (const slide of candidates) {
          try {
            await preloadImage(slide.url);
            ready.push(slide);
          } catch {
            // Skip broken remote slides so the hero never goes blank.
          }
        }

        if (!cancelled && ready.length > 0) {
          setSlides(ready);
          setIndex(0);
        }
      } catch {
        // Keep static fallback slide.
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (slides.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTO_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const active = slides[index] || slides[0];

  return (
    <section className="relative w-full overflow-hidden bg-[#f3eee6]">
      <div className="relative w-full" style={{ aspectRatio: "1920 / 654" }}>
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              slideIndex === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={slideIndex !== index}
          >
            <Image
              src={slide.url}
              alt={slide.alt}
              fill
              priority={slideIndex === 0}
              sizes="100vw"
              unoptimized
              className="object-cover object-center"
              onError={() => {
                setSlides((current) => {
                  const next = current.filter((item) => item.id !== slide.id);
                  return next.length > 0 ? next : FALLBACK_SLIDES;
                });
                setIndex(0);
              }}
            />
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show slide ${slideIndex + 1}`}
              aria-current={slideIndex === index}
              onClick={() => setIndex(slideIndex)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                slideIndex === index ? "bg-white" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      ) : null}

      <span className="sr-only">{active?.alt}</span>
    </section>
  );
}
