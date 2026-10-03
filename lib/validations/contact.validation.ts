import { z } from "zod";

export const contactSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be 100 characters or fewer")
        .refine((val) => !/^\d+$/.test(val), {
            message: "Name cannot be only numbers",
        }),

    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .max(254, "Email must be 254 characters or fewer")
        .email("Please enter a valid email address"),

    phone: z.string().superRefine((value, ctx) => {
        if (!value.trim()) {
            ctx.addIssue({
                code: "custom",
                message: "Contact number is required",
            });
            return;
        }

        if (!/^\d+$/.test(value)) {
            ctx.addIssue({
                code: "custom",
                message: "Only numbers are allowed",
            });
            return;
        }

        if (value.length !== 10) {
            ctx.addIssue({
                code: "custom",
                message: "Contact number must be exactly 10 digits",
            });
            return;
        }

        if (!/^[5-9]/.test(value)) {
            ctx.addIssue({
                code: "custom",
                message: "Must start with 5, 6, 7, 8, or 9",
            });
        }
    }),

    subject: z
        .string()
        .trim()
        .max(150, "Subject must be 150 characters or fewer")
        .refine((value) => value.length === 0 || value.length >= 2, {
            message: "Subject must be at least 2 characters",
        })
        .refine((value) => !/^\d+$/.test(value), {
            message: "Subject must be a valid text value",
        }),

    message: z
        .string()
        .trim()
        .min(5, "Message must be at least 5 characters")
        .max(1000, "Message must be 1000 characters or fewer"),
});

export type ContactFormData = z.infer<typeof contactSchema>;