"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ImageOff, Play } from "lucide-react";

import CatalogImage from "@/components/ui/CatalogImage";
import type { ProductImage, ProductVideo } from "@/types/product";

interface ProductImageGalleryProps {
  images?: ProductImage[] | null;
  video?: ProductVideo | null;
  productName: string;
  onExpired?: () => void;
}

type GalleryItem = {
  url: string;
  altText?: string;
  kind: "image" | "video";
};

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];

function mediaPath(url: string) {
  return url.split("?")[0].split("#")[0].toLowerCase();
}

function isVideoUrl(url: string) {
  const path = mediaPath(url);
  return VIDEO_EXTENSIONS.some((extension) => path.endsWith(extension));
}

export default function ProductImageGallery({
  images,
  video,
  productName,
  onExpired,
}: ProductImageGalleryProps) {
  const galleryImages: GalleryItem[] = (images || [])
    .filter((image) => Boolean(image?.url))
    .map((image) => ({
      url: image.url,
      altText: image.altText,
      kind: isVideoUrl(image.url) ? "video" : "image",
    }));

  if (video?.url) {
    const videoPath = mediaPath(video.url);
    const alreadyListed = galleryImages.some((item) => mediaPath(item.url) === videoPath);
    if (!alreadyListed) {
      galleryImages.push({
        url: video.url,
        altText: video.altText,
        kind: "video",
      });
    }
  }

  const hasImages = galleryImages.length > 0;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: galleryImages.length > 1,
    duration: 22,
    align: "start",
  });

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
      setSelectedIndex(index);
    },
    [emblaApi],
  );

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    setSelectedIndex(0);
    emblaApi?.scrollTo(0, true);
  }, [emblaApi, productName, galleryImages.length]);

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([index, element]) => {
      if (!element || Number(index) === selectedIndex) return;
      element.pause();
    });
  }, [selectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!hasImages || galleryImages.length < 2) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [galleryImages.length, hasImages, scrollNext, scrollPrev]);

  if (!hasImages) {
    return (
      <div className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-lg shadow-orange-100/50">
        <div className="relative flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.38),_transparent_42%),linear-gradient(135deg,_#ffedd5,_#ffffff_40%,_#fef3c7)] px-6 text-center">
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-orange-500 shadow-sm">
              <ImageOff className="h-6 w-6" aria-hidden />
            </div>
            <p className="text-sm font-medium text-slate-600">
              No product image available
            </p>
            <div className="relative h-16 w-16 opacity-40">
              <CatalogImage
                src={null}
                fallback="/kde-logo.png"
                alt={productName}
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const showControls = galleryImages.length > 1;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden">
        <div
          className="relative"
          role="region"
          aria-roledescription="carousel"
          aria-label={`${productName} images`}
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {galleryImages.map((image, index) => (
                <div
                  key={`${image.url}-${index}`}
                  className="relative aspect-[4/3] min-w-0 flex-[0_0_100%]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${image.kind === "video" ? "Video" : "Image"} ${index + 1} of ${galleryImages.length}`}
                >
                  {image.kind === "video" ? (
                    <div className="absolute inset-0 flex items-center justify-center px-4 pb-12 pt-4">
                      <video
                        ref={(element) => {
                          videoRefs.current[index] = element;
                        }}
                        src={image.url}
                        controls
                        playsInline
                        preload="metadata"
                        className="max-h-full max-w-full rounded-xl bg-black"
                        aria-label={image.altText || `${productName} video`}
                        onError={onExpired}
                      />
                    </div>
                  ) : (
                    <CatalogImage
                      src={image.url}
                      fallback="/kde-logo.png"
                      alt={image.altText || `${productName} — image ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-6"
                      onExpired={onExpired}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {showControls ? (
            <>
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-orange-100 bg-white/90 text-slate-700 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-orange-100 bg-white/90 text-slate-700 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>

              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                {galleryImages.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    type="button"
                    onClick={() => scrollTo(index)}
                    aria-label={`Go to ${galleryImages[index]?.kind === "video" ? "video" : `image ${index + 1}`}`}
                    aria-current={selectedIndex === index ? "true" : undefined}
                    className={`h-1.5 rounded-full transition-all ${
                      selectedIndex === index
                        ? "w-5 bg-[#7A330F]"
                        : "w-1.5 bg-slate-400/60 hover:bg-slate-500"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {showControls ? (
        <div
          className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {galleryImages.map((image, index) => {
            const isActive = selectedIndex === index;

            return (
              <button
                key={`thumb-${image.url}-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={
                  image.altText ||
                  (image.kind === "video"
                    ? `Show video of ${productName}`
                    : `Show image ${index + 1} of ${galleryImages.length}`)
                }
                onClick={() => scrollTo(index)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 bg-[linear-gradient(135deg,_#fff7ed,_#ffffff_50%,_#fef3c7)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 sm:h-[4.5rem] sm:w-[4.5rem] ${
                  isActive
                    ? "border-[#7A330F] shadow-sm"
                    : "border-orange-100 opacity-80 hover:opacity-100"
                }`}
              >
                {image.kind === "video" ? (
                  <>
                    <video
                      src={image.url}
                      muted
                      playsInline
                      preload="metadata"
                      className="pointer-events-none h-full w-full object-contain p-1.5"
                      aria-hidden
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7A330F]/90 text-white">
                        <Play className="h-3.5 w-3.5 fill-current" aria-hidden />
                      </span>
                    </span>
                  </>
                ) : (
                  <CatalogImage
                    src={image.url}
                    fallback="/kde-logo.png"
                    alt=""
                    fill
                    sizes="72px"
                    className="object-contain p-1.5"
                    onExpired={onExpired}
                  />
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
