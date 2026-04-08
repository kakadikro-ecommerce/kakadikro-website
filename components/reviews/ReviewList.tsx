"use client";

import { Edit3, Trash2, Star } from "lucide-react";

import type { Review } from "@/redux/api/reviewsApi";

type Props = {
  reviews: Review[];
  currentUserId?: string | null;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
  emptyText?: string;
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

export default function ReviewList({ reviews, currentUserId, onEdit, onDelete, emptyText }: Props) {
  if (!reviews.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/80 px-6 py-12 text-center text-slate-500">
        {emptyText ?? "No reviews yet. Be the first to share your experience."}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {reviews.map((review) => {
        const reviewId = review._id || review.id;
        const reviewerId = typeof review.user === "string" ? review.user : review.user?._id || review.user?.id;
        const isOwnReview = Boolean(currentUserId && reviewerId && currentUserId === reviewerId);
        const reviewerName = typeof review.user === "string" ? "Verified customer" : review.user?.name || "Verified customer";

        return (
          <article
            key={reviewId}
            className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_10px_35px_rgba(0,61,77,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(0,61,77,0.08)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-amber-200 text-sm font-semibold text-orange-800">
                  {reviewerName
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-slate-900">{reviewerName}</h4>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      Verified
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${index < review.rating ? "fill-current" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {isOwnReview && (onEdit || onDelete) ? (
                <div className="flex items-center gap-2 self-start">
                  {onEdit ? (
                    <button
                      type="button"
                      onClick={() => onEdit(review)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                  ) : null}
                  {onDelete ? (
                    <button
                      type="button"
                      onClick={() => onDelete(review)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>

            {review.comment ? (
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-[15px]">
                {review.comment}
              </p>
            ) : null}

            <div className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              {formatDate(review.createdAt)}
            </div>
          </article>
        );
      })}
    </div>
  );
}
