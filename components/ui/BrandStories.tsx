"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, X } from "lucide-react";
import { getBrandStories, type BrandStory } from "@/redux/api/brandVideoApi";
import { toCloudFrontMediaUrl } from "@/lib/image";

const CARD_WIDTH_PX = 260;
const CARD_GAP_PX = 20;

const formatPrice = (price?: number | null) => {
  if (typeof price !== "number") return "";
  return `₹${price.toLocaleString("en-IN")}`;
};

function BrandMark() {
  return (
    <span className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-2 text-[11px] font-semibold text-white drop-shadow">
      <img
        src="/assets/logo.png"
        alt=""
        className="h-7 w-7 rounded-full bg-white object-contain p-0.5 shadow-sm sm:h-8 sm:w-8"
      />
      Kaka Dikro
    </span>
  );
}

function ProductChip({
  story,
  onNavigate,
}: {
  story: BrandStory;
  onNavigate?: () => void;
}) {
  const product = story.product;
  if (!product?.slug) return null;

  return (
    <Link
      href={`/products/${product.slug}`}
      onClick={(event) => {
        event.stopPropagation();
        onNavigate?.();
      }}
      className="absolute bottom-3 left-3 right-3 z-10 flex items-center gap-2 rounded-xl bg-black/75 px-2.5 py-2 text-left text-white backdrop-blur-sm transition hover:bg-black/85"
    >
      {product.image ? (
        <img
          src={toCloudFrontMediaUrl(product.image)}
          alt=""
          className="h-10 w-10 shrink-0 rounded-md object-cover"
        />
      ) : (
        <span className="h-10 w-10 shrink-0 rounded-md bg-white/15" />
      )}
      <span className="min-w-0">
        <span className="block truncate text-[12px] font-semibold leading-tight">
          {product.name}
        </span>
        <span className="mt-0.5 block text-[13px] font-bold">
          {formatPrice(product.price)}
        </span>
      </span>
    </Link>
  );
}

function ReelCard({
  story,
  onOpen,
}: {
  story: BrandStory;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const playPreview = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => undefined);
  };

  const stopPreview = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <article
      className="relative w-[240px] shrink-0 snap-start overflow-hidden rounded-[22px] bg-[#1c140f] shadow-md sm:w-[260px]"
      onMouseEnter={playPreview}
      onMouseLeave={stopPreview}
    >
      <button
        type="button"
        onClick={onOpen}
        onFocus={playPreview}
        onBlur={stopPreview}
        className="relative block aspect-[9/16] w-full text-left"
        aria-label={`Play story for ${story.product?.name || "product"}`}
      >
        <video
          ref={videoRef}
          src={toCloudFrontMediaUrl(story.video?.url)}
          className="h-full w-full object-cover"
          muted
          playsInline
          loop
          preload="metadata"
        />
        <BrandMark />
      </button>
      <ProductChip story={story} />
    </article>
  );
}

function StoryViewer({
  stories,
  index,
  onChange,
  onClose,
}: {
  stories: BrandStory[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  // Opened from a click, so sound is allowed. Strip hover previews stay muted.
  const [muted, setMuted] = useState(false);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChange(Math.min(stories.length - 1, index + 1));
      if (event.key === "ArrowLeft") onChange(Math.max(0, index - 1));
      if (event.key === "m" || event.key === "M") setMuted((value) => !value);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [index, onChange, onClose, stories.length]);

  useEffect(() => {
    const video = activeVideoRef.current;
    if (!video) return;

    video.muted = muted;
    video.volume = 1;

    const play = video.play();
    if (play) {
      play.catch(() => {
        // Some browsers still block unmuted autoplay when switching videos.
        video.muted = true;
        setMuted(true);
        void video.play().catch(() => undefined);
      });
    }
  }, [index, muted, stories]);

  const neighbors = [index - 1, index, index + 1].filter(
    (item) => item >= 0 && item < stories.length
  );

  const viewer = (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 px-3 py-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
        aria-label="Close stories"
      >
        <X size={22} />
      </button>

      {index > 0 && (
        <button
          type="button"
          onClick={() => onChange(index - 1)}
          className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#3E2723] shadow md:flex"
          aria-label="Previous video"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {index < stories.length - 1 && (
        <button
          type="button"
          onClick={() => onChange(index + 1)}
          className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#3E2723] shadow md:flex"
          aria-label="Next video"
        >
          <ChevronRight size={22} />
        </button>
      )}

      <div className="flex max-w-full items-end justify-center gap-4">
        {neighbors.map((itemIndex) => {
          const story = stories[itemIndex];
          const active = itemIndex === index;

          return (
            <div
              key={story.id}
              className={`relative overflow-hidden rounded-[22px] bg-black shadow-2xl ${
                active
                  ? "h-[min(76vh,720px)] w-[min(86vw,380px)]"
                  : "hidden h-[min(58vh,520px)] w-[190px] opacity-80 md:block"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  if (!active) onChange(itemIndex);
                }}
                className="block h-full w-full"
                aria-label={active ? "Current video" : `Open ${story.product?.name || "video"}`}
              >
                <video
                  key={`${story.id}-${active ? "play" : "idle"}`}
                  ref={active ? activeVideoRef : undefined}
                  src={toCloudFrontMediaUrl(story.video?.url)}
                  className="h-full w-full object-cover"
                  muted={!active || muted}
                  playsInline
                  loop
                  autoPlay={active}
                  preload={active ? "auto" : "metadata"}
                />
                <BrandMark />
              </button>
              {active ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMuted((value) => !value);
                  }}
                  className="absolute right-3 top-3 z-20 rounded-full bg-black/55 p-2 text-white backdrop-blur-sm hover:bg-black/70"
                  aria-label={muted ? "Unmute video" : "Mute video"}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              ) : null}
              <ProductChip story={story} onNavigate={onClose} />
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 flex items-center gap-3 md:hidden">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onChange(index - 1)}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3E2723] disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={index === stories.length - 1}
          onClick={() => onChange(index + 1)}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3E2723] disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );

  return createPortal(viewer, document.body);
}

export default function BrandStories() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [stories, setStories] = useState<BrandStory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [needsNav, setNeedsNav] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getBrandStories()
      .then((items) => {
        if (!cancelled) setStories(items);
      })
      .catch(() => {
        if (!cancelled) setStories([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || stories.length === 0) {
      setNeedsNav(false);
      return;
    }

    const updateNeedsNav = () => {
      setNeedsNav(scroller.scrollWidth > scroller.clientWidth + 2);
    };

    updateNeedsNav();

    const observer = new ResizeObserver(updateNeedsNav);
    observer.observe(scroller);
    window.addEventListener("resize", updateNeedsNav);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateNeedsNav);
    };
  }, [stories]);

  if (stories.length === 0) return null;

  const scrollByCard = (direction: number) => {
    scrollerRef.current?.scrollBy({
      left: direction * (CARD_WIDTH_PX + CARD_GAP_PX),
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#FFF9F5] py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-[#3d3428] md:text-4xl">
            Watch Our Stories
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#6d6256] md:text-base">
            Tap, shop, and explore authentic stories from our products.
          </p>
        </div>

        <div className="relative">
          {needsNav ? (
            <>
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#3E2723] shadow md:flex"
                aria-label="Previous videos"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#3E2723] shadow md:flex"
                aria-label="Next videos"
              >
                <ChevronRight size={20} />
              </button>
            </>
          ) : null}

          <div
            ref={scrollerRef}
            className={`flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              needsNav ? "" : "justify-center"
            }`}
          >
            {stories.map((story, index) => (
              <ReelCard
                key={story.id}
                story={story}
                onOpen={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {activeIndex !== null && (
        <StoryViewer
          stories={stories}
          index={activeIndex}
          onChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </section>
  );
}
