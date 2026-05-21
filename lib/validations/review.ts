import * as z from "zod";

const objectIdSchema = z
  .string()
  .min(1, "ID is required")
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid ID");

export const createReviewSchema = z.object({
  productId: objectIdSchema,
  rating: z.number().int("Rating must be an integer").min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().trim().max(2000, "Comment is too long").optional().or(z.literal("")),
});

export const updateReviewSchema = z.object({
  rating: z.number().int("Rating must be an integer").min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").optional(),
  comment: z.string().trim().max(2000, "Comment is too long").optional().or(z.literal("")),
}).refine((value) => value.rating !== undefined || value.comment !== undefined, {
  message: "Please update at least one field",
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
