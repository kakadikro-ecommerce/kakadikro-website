"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

import type { Review } from "@/redux/api/reviewsApi";
import ReviewList from "@/components/reviews/ReviewList";

type Props = {
  reviews?: Review[];
  title?: string;
  description?: string;
  badge?: string;
  loading?: boolean;
  emptyText?: string;
  showCarousel?: boolean;
  showStaticFallback?: boolean;
};

const staticReviews: Review[] = [
  { _id: "1", rating: 5, comment: "Kakadikro spices bring back the flavor we grew up with.", user: { name: "Rakesh Patel" } },
  { _id: "2", rating: 5, comment: "Fresh, balanced, and clean. Every dish feels more comforting.", user: { name: "Neha Shah" } },
  { _id: "3", rating: 5, comment: "Every pack tastes consistent, and my family notices the difference.", user: { name: "Mahesh Desai" } },
  { _id: "4", rating: 5, comment: "Rich color, beautiful aroma, and a premium blend for daily cooking.", user: { name: "Pooja Mehta" } },
];

export default function CustomerReviews({
  reviews,
  title = "Customer Reviews",
  description = "Real feedback from families who want bold flavor, dependable quality, and masalas that feel close to home.",
  badge = "Customer Reviews",
  loading = false,
  emptyText,
  showCarousel = true,
  showStaticFallback = true,
}: Props) {
  const list = useMemo(
    () => (reviews?.length ? reviews : showStaticFallback ? staticReviews : []),
    [reviews, showStaticFallback]
  );
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!showCarousel || list.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % list.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [list.length, showCarousel]);

  const activeReview = useMemo(() => list[current] ?? list[0], [current, list]);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-orange-200 bg-white/80 px-4 py-1 text-sm font-medium text-orange-700">
            {badge}
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white/95 p-5 shadow-[0_22px_60px_rgba(0,61,77,0.08)] sm:p-6 lg:flex lg:flex-col lg:justify-center">
            {loading ? (
              <div className="min-h-[260px] animate-pulse rounded-[1.5rem] bg-slate-100" />
            ) : showCarousel && list.length ? (
              <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-orange-100 via-amber-50 to-white p-8">
                  <div className="absolute right-6 top-6 rounded-full bg-white/80 p-3 text-orange-500">
                    <Quote className="h-5 w-5" />
                  </div>
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white text-4xl font-bold text-orange-600 shadow-sm">
                    {(typeof activeReview.user === "string" ? "CU" : activeReview.user?.name || "CU")
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-xl font-semibold text-slate-900">
                      {typeof activeReview.user === "string" ? "Verified Customer" : activeReview.user?.name || "Verified Customer"}
                    </p>
                    <p className="mt-2 text-sm font-medium uppercase tracking-[0.24em] text-orange-600">
                      Loved by shoppers
                    </p>
                  </div>
                </div>

                <div className="text-center lg:text-left">
                  <div className="flex justify-center gap-1 text-amber-400 lg:justify-start">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${index < activeReview.rating ? "fill-current" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-5 text-xl font-semibold text-slate-900 sm:text-2xl">
                    {activeReview.comment || "No comment provided."}
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
                    {list.map((review, index) => (
                      <button
                        key={review._id || review.id || index}
                        type="button"
                        onClick={() => setCurrent(index)}
                        aria-label={`Go to review ${index + 1}`}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          index === current ? "w-10 bg-orange-500" : "w-2.5 bg-orange-200 hover:bg-orange-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <ReviewList reviews={list} emptyText={emptyText} />
            )}

            <div className="mt-6 flex items-center justify-center gap-4 lg:mt-4">
              <button
                type="button"
                onClick={() => list.length && setCurrent((prev) => (prev - 1 + list.length) % list.length)}
                disabled={!list.length}
                aria-label="Previous review"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-orange-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => list.length && setCurrent((prev) => (prev + 1) % list.length)}
                disabled={!list.length}
                aria-label="Next review"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-orange-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_22px_60px_rgba(0,61,77,0.06)] sm:p-6">
            <ReviewList reviews={list.slice(0, 3)} emptyText={emptyText} />
          </div>
        </div>
      </div>
    </section>
  );
}
