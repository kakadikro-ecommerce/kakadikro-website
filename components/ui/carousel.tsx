"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

type CarouselSlide = {
  id: number;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
};

const slides: CarouselSlide[] = [
  {
    id: 1,
    image: "/assets/hero1.webp",
    alt: "Organic products arranged on a rustic table",
    eyebrow: "From Our Farm",
    title: "Clean Organic Goodness For Everyday Living",
    description:
      "Fresh, honest essentials crafted with care for families who want purity, flavor, and trust in every order.",
    primaryCta: "Shop Bestsellers",
    secondaryCta: "Explore Collection",
  },
  {
    id: 2,
    image: "/assets/hero2.webp",
    alt: "Natural ingredients and traditional farm produce",
    eyebrow: "Rooted In Tradition",
    title: "Ayurvedic Wellness Meets Modern Convenience",
    description:
      "Discover naturally made pantry staples and wellness favorites inspired by heritage and prepared for today.",
    primaryCta: "View Products",
    secondaryCta: "Learn Our Story",
  },
  {
    id: 3,
    image: "/assets/hero3.webp",
    alt: "Fresh farm harvest in warm natural light",
    eyebrow: "Freshly Curated",
    title: "Wholesome Choices That Feel Good To Bring Home",
    description:
      "Handpicked products, earthy textures, and nourishing flavors designed to make daily routines more delightful.",
    primaryCta: "Start Shopping",
    secondaryCta: "Why Choose Us",
  },
  {
    id: 4,
    image: "/assets/hero4.webp",
    alt: "Organic lifestyle products displayed in an artisanal setting",
    eyebrow: "Pure And Premium",
    title: "Farm-Fresh Essentials With A Beautiful Experience",
    description:
      "A richer shopping journey with elevated visuals, trusted sourcing, and products that look as good as they feel.",
    primaryCta: "Browse Range",
    secondaryCta: "See New Arrivals",
  },
  {
    id: 5,
    image: "/assets/hero5.webp",
    alt: "Organic packaged goods presented for a hero banner",
    eyebrow: "Delivered With Care",
    title: "Bring Home Better Ingredients, Naturally",
    description:
      "From nourishing staples to gift-worthy favorites, explore a collection built around quality and authenticity.",
    primaryCta: "Order Now",
    secondaryCta: "Contact Us",
  },
];

const AUTOPLAY_DELAY = 4000;

const Carousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 30,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    let autoplay: NodeJS.Timeout;

    const start = () => {
      autoplay = setInterval(() => {
        emblaApi.scrollNext();
      }, AUTOPLAY_DELAY);
    };

    const stop = () => clearInterval(autoplay);

    start();

    emblaApi.on("pointerDown", stop);
    emblaApi.on("pointerUp", start);

    return () => {
      stop();
      emblaApi.off("pointerDown", stop);
      emblaApi.off("pointerUp", start);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  return (
    <section className="w-full">
      <div className="relative overflow-hidden bg-[#11332c]">

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex will-change-transform">

            {slides.map((slide) => (
              <div key={slide.id} className="flex-[0_0_100%]">
                <article className="relative h-[360px] sm:h-[460px] lg:h-[620px] overflow-hidden">

                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={slide.id === 1}
                    sizes="100vw"
                    quality={75}
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,27,22,0.86)_0%,rgba(8,27,22,0.58)_42%,rgba(8,27,22,0.18)_100%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(241,208,133,0.22),transparent_34%)]" />

                  <div className="relative z-10 flex h-full items-center px-5 py-8 sm:px-8 lg:px-14">
                    <div className="max-w-2xl text-white">
                      <p className="mb-3 text-xs uppercase tracking-widest">
                        {slide.eyebrow}
                      </p>

                      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold">
                        {slide.title}
                      </h2>

                      <p className="mt-3 text-sm sm:text-base lg:text-lg text-white/85">
                        {slide.description}
                      </p>

                      <div className="mt-5 flex gap-3 flex-wrap">
                        <Link
                          href="/"
                          className="px-5 py-2 bg-[#f3d98b] text-[#173129] rounded-full font-medium hover:bg-[#f7e3a8]"
                        >
                          {slide.primaryCta}
                        </Link>

                        <Link
                          href="/"
                          className="px-5 py-2 border border-white/40 rounded-full"
                        >
                          {slide.secondaryCta}
                        </Link>
                      </div>
                    </div>
                  </div>

                </article>
              </div>
            ))}

          </div>
        </div>

        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-3 rounded-full"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-3 rounded-full"
        >
          <ChevronRight />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-2 rounded-full transition-all ${
                selectedIndex === i ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Carousel;