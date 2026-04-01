"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  title: string;
  review: string;
  image: string;
}

const createAvatarDataUri = (
  name: string,
  startColor: string,
  endColor: string,
  accentColor: string,
) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const svg = `
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="avatarGradient" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
          <stop stop-color="${startColor}" />
          <stop offset="1" stop-color="${endColor}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="80" fill="url(#avatarGradient)" />
      <circle cx="122" cy="40" r="16" fill="${accentColor}" fill-opacity="0.25" />
      <circle cx="40" cy="122" r="22" fill="#FFF7ED" fill-opacity="0.35" />
      <text
        x="50%"
        y="54%"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="white"
        font-size="48"
        font-family="Georgia, serif"
        font-weight="700"
      >
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const reviews: Review[] = [
  {
    id: 1,
    name: "Rakesh Patel",
    title: "Authentic Taste!",
    review:
      "Kakadikro spices brings back the flavor of the hand-ground spices we grew up with. The aroma fills the kitchen instantly.",
    image: createAvatarDataUri("Rakesh Patel", "#F97316", "#FDBA74", "#7C2D12"),
  },
  {
    id: 2,
    name: "Neha Shah",
    title: "Pure & Fresh",
    review:
      "The masalas taste fresh, balanced, and clean. Even simple sabzi feels more comforting and full of flavor.",
    image: createAvatarDataUri("Neha Shah", "#EA580C", "#FB923C", "#9A3412"),
  },
  {
    id: 3,
    name: "Mahesh Desai",
    title: "Best Quality",
    review:
      "Consistency is what impressed me most. Every pack tastes just as good as the last one, and my family notices the difference.",
    image: createAvatarDataUri("Mahesh Desai", "#C2410C", "#F59E0B", "#7C2D12"),
  },
  {
    id: 4,
    name: "Pooja Mehta",
    title: "Highly Recommended",
    review:
      "Rich color, beautiful aroma, and no dull aftertaste. It feels like a premium blend made for everyday Gujarati cooking.",
    image: createAvatarDataUri("Pooja Mehta", "#FB923C", "#FCD34D", "#9A3412"),
  },
  {
    id: 5,
    name: "Amit Trivedi",
    title: "Feels Homemade",
    review:
      "This is the closest I have found to homemade masala. It gives dal, shaak, and snacks that warm traditional touch.",
    image: createAvatarDataUri("Amit Trivedi", "#B45309", "#F59E0B", "#78350F"),
  },
  {
    id: 6,
    name: "Kiran Joshi",
    title: "Amazing Aroma",
    review:
      "The moment you open the pack, you know the ingredients are good. The aroma stays vibrant even after cooking.",
    image: createAvatarDataUri("Kiran Joshi", "#F59E0B", "#FDBA74", "#92400E"),
  },
];

export default function CustomerReviews() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);

  const activeReview = reviews[current];

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-orange-200 bg-white/80 px-4 py-1 text-sm font-medium text-orange-700">
            Customer Reviews
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Loved in everyday kitchens
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Real feedback from families who want bold flavor, dependable quality,
            and masalas that feel close to home.
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-4xl">
          <div className="absolute inset-x-10 top-6 -z-10 h-full rounded-[2rem]" />

          <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white/95 backdrop-blur">
            <div
              className="grid items-center gap-8 p-6 transition-all duration-500 ease-out sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10"
              key={activeReview.id}
            >
              <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-orange-100 via-amber-50 to-white p-8">
                <div className="absolute right-6 top-6 rounded-full bg-white/80 p-3 text-orange-500">
                  <Quote className="h-5 w-5" />
                </div>

                <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white sm:h-36 sm:w-36">
                  <Image
                    src={activeReview.image}
                    alt={activeReview.name}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xl font-semibold text-slate-900">{activeReview.name}</p>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.24em] text-orange-600">
                    Verified Buyer
                  </p>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex justify-center gap-1 text-amber-400 lg:justify-start">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-current" />
                  ))}
                </div>

                <h3 className="mt-5 text-2xl font-semibold text-slate-900 sm:text-3xl">
                  {activeReview.title}
                </h3>

                <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
                  &ldquo;{activeReview.review}&rdquo;
                </p>

                <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
                  {reviews.map((review, index) => (
                    <button
                      key={review.id}
                      type="button"
                      onClick={() => setCurrent(index)}
                      aria-label={`Go to review from ${review.name}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${index === current
                          ? "w-10 bg-orange-500"
                          : "w-2.5 bg-orange-200 hover:bg-orange-300"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous review"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-orange-200 bg-white text-slate-700  transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next review"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-orange-200 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
