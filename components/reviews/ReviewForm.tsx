"use client";

import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";

import { createReviewSchema, type CreateReviewInput, updateReviewSchema, type UpdateReviewInput } from "@/lib/validations/review";

type ReviewFormValues = {
  productId?: string;
  rating?: number;
  comment?: string;
};

type Props =
  | {
      mode: "create";
      initialValues?: Partial<CreateReviewInput>;
      onSubmit: (values: CreateReviewInput) => Promise<void> | void;
      submitLabel?: string;
      cancelLabel?: never;
      onCancel?: never;
      loading?: boolean;
      submitDisabled?: boolean;
      className?: string;
      commentRows?: number;
      statusMessage?: string;
    }
  | {
      mode: "edit";
      initialValues: Partial<UpdateReviewInput>;
      onSubmit: (values: UpdateReviewInput) => Promise<void> | void;
      submitLabel?: string;
      cancelLabel?: string;
      onCancel: () => void;
      loading?: boolean;
      submitDisabled?: boolean;
      className?: string;
      commentRows?: number;
      statusMessage?: string;
    };

const ratingLabels = ["Poor", "Fair", "Good", "Very good", "Excellent"];

export default function ReviewForm(props: Props) {
  const schema = props.mode === "create" ? createReviewSchema : updateReviewSchema;
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(schema),
    defaultValues: props.initialValues as ReviewFormValues,
    mode: "onTouched",
  });

  useEffect(() => {
    reset(props.initialValues as ReviewFormValues);
  }, [props.initialValues, reset]);

  const watchedRating = useWatch({ control, name: "rating" });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await props.onSubmit(values as CreateReviewInput & UpdateReviewInput);
        if (props.mode === "create") {
          reset({ rating: 0, comment: "" });
        }
      })}
      className={`rounded-[28px] border border-orange-100 bg-white p-5 shadow-[0_18px_60px_rgba(0,61,77,0.08)] sm:p-6 ${props.className ?? ""}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
            {props.mode === "create" ? "Write a review" : "Edit your review"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Share honest feedback that helps other shoppers decide faster.
          </p>
        </div>
      </div>

      {props.statusMessage ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {props.statusMessage}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        {props.mode === "create" ? <input type="hidden" {...register("productId")} /> : null}
        <div className="sm:col-span-2">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Rating
          </div>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <div className="flex flex-wrap items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const rating = index + 1;
                  const filled = Number(field.value || 0) >= rating;
                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => field.onChange(rating)}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${
                        filled
                          ? "border-amber-300 bg-amber-50 text-amber-500"
                          : "border-slate-200 bg-white text-slate-300 hover:border-amber-200 hover:text-amber-400"
                      }`}
                      aria-label={`${rating} star${rating > 1 ? "s" : ""} - ${ratingLabels[index]}`}
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>
                  );
                })}
                <span className="text-sm font-medium text-slate-600">
                  {ratingLabels[Math.max((Number(watchedRating) || 1) - 1, 0)]}
                </span>
              </div>
            )}
          />
          {errors.rating ? <p className="mt-1 text-sm text-rose-600">{errors.rating.message as string}</p> : null}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Comment
          </label>
          <textarea
            {...register("comment")}
            rows={props.commentRows ?? 4}
            placeholder="Tell others what stood out about the product..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
          />
          {errors.comment ? <p className="mt-1 text-sm text-rose-600">{errors.comment.message as string}</p> : null}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
        {props.mode === "edit" ? (
          <button
            type="button"
            onClick={props.onCancel}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {props.cancelLabel ?? "Cancel"}
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting || props.loading || props.submitDisabled}
          className="inline-flex w-full rounded-full bg-[#003d4d] items-center justify-center px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d5d6c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {props.submitLabel ?? (props.mode === "create" ? "Post review" : "Update review")}
        </button>
      </div>
    </form>
  );
}
