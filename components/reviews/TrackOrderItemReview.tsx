"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit3, Star, Trash2 } from "lucide-react";

import { showAlert } from "@/components/ui/alert";
import ReviewForm from "@/components/reviews/ReviewForm";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { Review } from "@/redux/api/reviewsApi";
import { editReview, fetchReviewsByProductId, removeReview, submitReview } from "@/redux/slice/reviewsSlice";

type Props = {
  productId: string;
  delivered?: boolean;
};

export default function TrackOrderItemReview({ productId, delivered }: Props) {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);
  const reviews = useAppSelector((state) => state.reviews.byProductId[productId] || []);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  useEffect(() => {
    if (delivered) {
      void dispatch(fetchReviewsByProductId({ productId }));
    }
  }, [delivered, dispatch, productId]);

  const ownReview = useMemo(
    () =>
      currentUser
        ? reviews.find((review) => {
            const reviewerId = typeof review.user === "string" ? review.user : review.user?._id || review.user?.id;
            return reviewerId && String(reviewerId) === String(currentUser.id || currentUser._id);
          })
        : undefined,
    [currentUser, reviews]
  );

  const handleCreate = async (values: { productId: string; rating: number; comment?: string }) => {
    try {
      await dispatch(submitReview(values)).unwrap();
      showAlert({ type: "success", message: "Review submitted." });
      void dispatch(fetchReviewsByProductId({ productId }));
    } catch (message) {
      showAlert({ type: "error", message: typeof message === "string" ? message : "Unable to submit review." });
    }
  };

  const handleUpdate = async (values: { rating?: number; comment?: string }) => {
    if (!editingReview) return;
    try {
      await dispatch(editReview({ reviewId: editingReview._id || editingReview.id || "", payload: values })).unwrap();
      setEditingReview(null);
      showAlert({ type: "success", message: "Review updated." });
      void dispatch(fetchReviewsByProductId({ productId }));
    } catch (message) {
      showAlert({ type: "error", message: typeof message === "string" ? message : "Unable to update review." });
    }
  };

  const handleDelete = async (review: Review) => {
    const reviewId = review._id || review.id;
    if (!reviewId || !window.confirm("Delete your review?")) return;
    try {
      await dispatch(removeReview(reviewId)).unwrap();
      showAlert({ type: "success", message: "Review deleted." });
      void dispatch(fetchReviewsByProductId({ productId }));
    } catch (message) {
      showAlert({ type: "error", message: typeof message === "string" ? message : "Unable to delete review." });
    }
  };

  if (!delivered) {
    return null;
  }

  if (editingReview) {
    return (
      <div className="mt-4 rounded-[28px] border border-orange-100 bg-gradient-to-br from-white to-orange-50/40 p-4 shadow-[0_18px_60px_rgba(0,61,77,0.08)] sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Edit your review</p>
            <p className="mt-1 text-sm text-slate-500">
              Update your rating or rewrite the comment for this delivered item.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditingReview(null)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
        <ReviewForm
          mode="edit"
          initialValues={{ rating: editingReview.rating, comment: editingReview.comment || "" }}
          onSubmit={handleUpdate}
          onCancel={() => setEditingReview(null)}
          className="min-h-[360px]"
          commentRows={7}
        />
      </div>
    );
  }

  if (ownReview) {
    return (
      <div className="mt-4 rounded-[28px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-900">Your review</p>
            <div className="mt-2 flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className={`h-4 w-4 ${index < ownReview.rating ? "fill-current" : "text-amber-200"}`} />
              ))}
            </div>
            {ownReview.comment ? (
              <p className="mt-3 line-clamp-3 text-sm leading-7 text-emerald-900/80">
                {ownReview.comment}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingReview(null);
                setIsComposerOpen((prev) => !prev);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
            >
              <Edit3 className="h-3.5 w-3.5" />
              {isComposerOpen ? "Close editor" : "Edit"}
            </button>
            <button
              type="button"
              onClick={() => handleDelete(ownReview)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>

        {isComposerOpen ? (
          <div className="mt-4 rounded-2xl p-4 sm:p-5">
            <ReviewForm
              mode="edit"
              initialValues={{ rating: ownReview.rating, comment: ownReview.comment || "" }}
              onSubmit={handleUpdate}
              onCancel={() => setIsComposerOpen(false)}
              cancelLabel="Close"
              className="min-h-[360px]"
              commentRows={3}
            />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_14px_45px_rgba(0,61,77,0.06)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Share your experience</p>
          <p className="mt-1 text-sm text-slate-500">
            Your review helps other customers decide with confidence.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsComposerOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-full bg-[#003d4d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d5d6c]"
        >
          {isComposerOpen ? "Close review form" : "Write review"}
        </button>
      </div>

      {isComposerOpen ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-[#fbfefd] p-4 sm:p-5">
          <ReviewForm
            mode="create"
            initialValues={{ productId, rating: 0, comment: "" }}
            onSubmit={async (values) => {
              await handleCreate(values);
              setIsComposerOpen(false);
            }}
            className="min-h-[320px]"
            commentRows={6}
          />
        </div>
      ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-[#d9ebe6] bg-[#fbfefd] px-4 py-6 text-sm text-slate-500">
            Tap &quot;Write review&quot; to open a full-size form when you are ready.
          </div>
        )}
    </div>
  );
}
