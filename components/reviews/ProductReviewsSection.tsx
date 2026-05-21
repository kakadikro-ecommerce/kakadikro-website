"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { showAlert } from "@/components/ui/alert";
import CustomerReviews from "@/components/ui/CustomerReviews";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { CreateReviewInput } from "@/lib/validations/review";
import {
  editReview,
  fetchReviewsByProductId,
  removeReview,
  submitReview,
} from "@/redux/slice/reviewsSlice";
import { getReviewEligibility } from "@/redux/api/reviewsApi";

import type { Review } from "@/redux/api/reviewsApi";

type Props = {
  productId: string;
  showCreateForm?: boolean;
  showStaticReviews?: boolean;
};

export default function ProductReviewsSection({
  productId,
  showCreateForm = true,
  showStaticReviews = false,
}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const { currentUser } = useAppSelector((state) => state.user);
  const reviews = useAppSelector((state) => state.reviews.byProductId[productId] || []);
  const loading = useAppSelector((state) => state.reviews.loadingByProductId[productId] || false);
  const error = useAppSelector((state) => state.reviews.errorByProductId[productId]);
  const mutationLoading = useAppSelector((state) => state.reviews.mutationLoading);

  useEffect(() => {
    void dispatch(fetchReviewsByProductId({ productId }));
  }, [dispatch, productId]);

  useEffect(() => {
    if (!showCreateForm || !currentUser) {
      setCreateError(null);
      return;
    }

    let active = true;
    setEligibilityLoading(true);

    void getReviewEligibility(productId)
      .then((result) => {
        if (!active) return;
        setCreateError(
          result.canReview
            ? null
            : result.alreadyReviewed
              ? "You have already reviewed this product."
              : "You can only review products from delivered orders. Please purchase and receive this product first."
        );
      })
      .catch(() => {
        if (!active) return;
        setCreateError(null);
      })
      .finally(() => {
        if (active) {
          setEligibilityLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [currentUser, productId, showCreateForm]);

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

  const handleCreate = async (values: CreateReviewInput) => {
    if (!currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(`/products/${productId}`)}`);
      return;
    }

    setCreateError(null);

    try {
      await dispatch(submitReview(values)).unwrap();
      showAlert({ type: "success", message: "Your review has been posted." });
      void dispatch(fetchReviewsByProductId({ productId }));
    } catch (message) {
      const errorMessage =
        typeof message === "string"
          ? message
          : "Unable to post review right now.";
      setCreateError(
        errorMessage.includes("delivered orders")
          ? "You can only review products from delivered orders. Please buy and receive this product before posting a review."
          : errorMessage
      );
    }
  };

  const handleUpdate = async (values: { rating?: number; comment?: string }) => {
    if (!editingReview) return;
    try {
      await dispatch(editReview({ reviewId: editingReview._id || editingReview.id || "", payload: values })).unwrap();
      setEditingReview(null);
      showAlert({ type: "success", message: "Your review was updated." });
      void dispatch(fetchReviewsByProductId({ productId }));
    } catch (message) {
      showAlert({
        type: "error",
        message: typeof message === "string" ? message : "Unable to update review right now.",
      });
    }
  };

  const handleDelete = async (review: Review) => {
    const reviewId = review._id || review.id;
    if (!reviewId) return;
    if (!window.confirm("Delete your review?")) return;

    try {
      await dispatch(removeReview(reviewId)).unwrap();
      showAlert({ type: "success", message: "Your review was deleted." });
      void dispatch(fetchReviewsByProductId({ productId }));
    } catch (message) {
      showAlert({
        type: "error",
        message: typeof message === "string" ? message : "Unable to delete review right now.",
      });
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <CustomerReviews
          reviews={reviews}
          loading={loading}
          showCarousel
          title="Customer reviews"
          description="See what real customers say after buying and using this product."
          badge="Verified reviews"
          emptyText="No reviews for this product yet."
          showStaticFallback={showStaticReviews}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          {showCreateForm && !ownReview ? (
            <ReviewForm
              mode="create"
              initialValues={{ productId, rating: 5, comment: "" }}
              onSubmit={handleCreate}
              loading={mutationLoading}
              submitDisabled={Boolean(currentUser && createError)}
              statusMessage={eligibilityLoading ? "Checking whether you can review this product..." : createError ?? undefined}
            />
          ) : null}

          <div className="space-y-4">
            {editingReview ? (
              <ReviewForm
                mode="edit"
                initialValues={{ rating: editingReview.rating, comment: editingReview.comment || "" }}
                onSubmit={handleUpdate}
                onCancel={() => setEditingReview(null)}
                loading={mutationLoading}
                cancelLabel="Close"
                className="min-h-[340px]"
                commentRows={7}
              />
            ) : null}

            <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(0,61,77,0.06)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">All reviews</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {reviews.length} review{reviews.length === 1 ? "" : "s"} collected so far.
                  </p>
                </div>
                {error ? <span className="text-sm text-rose-600">{error}</span> : null}
              </div>
              <ReviewList
                reviews={reviews}
                currentUserId={currentUser?.id || currentUser?._id}
                onEdit={setEditingReview}
                onDelete={handleDelete}
              />
              {!ownReview && currentUser ? (
                <p className="mt-4 text-xs text-slate-500">
                  You can edit or delete only the review you posted for this product.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
