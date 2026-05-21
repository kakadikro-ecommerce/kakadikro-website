import { z } from "zod";

export const contactSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters")
        .refine((val) => !/^\d+$/.test(val), {
            message: "Name cannot be only numbers",
        }),

    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),

    phone: z
        .string()
        .min(1, "Contact number is required")
        .regex(/^\d+$/, "Only numbers are allowed")
        .length(10, "Contact number must be exactly 10 digits")
        .regex(/^[5-9]/, "Must start with 5, 6, 7, 8, or 9"),

    message: z
        .string()
        .min(5, "Message must be at least 5 characters")
        .max(1000, "Message must be less than 1000 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;