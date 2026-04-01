import * as z from "zod";

export const shippingAddressSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
  addressLine1: z
    .string()
    .min(1, "Address line 1 is required")
    .min(5, "Address line 1 must be at least 5 characters"),
  addressLine2: z.string().optional(),
  city: z
    .string()
    .min(1, "City is required")
    .min(2, "City must be at least 2 characters"),
  state: z
    .string()
    .min(1, "State is required")
    .min(2, "State must be at least 2 characters"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(/^[0-9]{6}$/, "Enter a valid 6-digit postal code"),
  country: z
    .string()
    .min(1, "Country is required")
    .min(2, "Country must be at least 2 characters"),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
