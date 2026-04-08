"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useSelector } from "react-redux";

import { showAlert } from "@/components/ui/alert";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { submitContact } from "@/redux/slice/contactSlice";
import { RootState } from "@/redux/store";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact.validation";

type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const inputClassName =
  "w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

export default function ContactUs() {
  const dispatch = useAppDispatch();
  const { loading } = useSelector((state: RootState) => state.contact);
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const nextValue = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: ContactFormErrors = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ContactFormErrors;
        fieldErrors[field] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }

    try {
      await dispatch(submitContact(formData)).unwrap();
      setIsSubmitted(true);
      setFormData(initialFormData);
      setErrors({});
    } catch (error: unknown) {
      showAlert({
        type: "error",
        message:
          typeof error === "string"
            ? error
            : error instanceof Error
              ? error.message
              : "Failed to send message",
      });
    }
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-orange-200 bg-white px-4 py-1 text-sm font-medium text-orange-700">
            Contact Us
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Let&apos;s talk about your next order
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Reach out for product questions, bulk enquiries, or help choosing
            the right masala for your kitchen.
          </p>
        </div>

        <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_28px_80px_-38px_rgba(194,65,12,0.35)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[420px]">
            <Image
              src="/assets/contact.webp"
              alt="Spices and ingredients arranged on a table"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/75 to-orange-900/70" />

            <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white sm:p-10">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-orange-200">
                  Get in touch
                </p>
                <h3 className="mt-4 max-w-sm text-3xl font-semibold leading-tight sm:text-4xl">
                  We&apos;re here to help your kitchen stay full of flavor.
                </h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-orange-50/85 sm:text-base">
                  Whether you&apos;re shopping for home cooking or wholesale supply,
                  our team will get back to you quickly.
                </p>
              </div>

              <div className="mt-10 space-y-5">
                <div className="flex items-start gap-4 p-4">
                  <div className="rounded-full bg-white/15 p-3 text-orange-200">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Address</p>
                    <p className="mt-1 text-sm leading-6 text-orange-50/85">
                      Kakadikro spices, Ahmedabad, Gujarat, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4">
                  <div className="rounded-full bg-white/15 p-3 text-orange-200">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Phone</p>
                    <p className="mt-1 text-sm leading-6 text-orange-50/85">
                      +91 98765 43210
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4">
                  <div className="rounded-full bg-white/15 p-3 text-orange-200">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Email</p>
                    <p className="mt-1 text-sm leading-6 text-orange-50/85">
                      hello@kakadikrospices.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex min-h-[420px] items-center justify-center rounded-[1.75rem] p-6 sm:p-8">
              {isSubmitted ? (
                <div className="max-w-md text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <svg
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold text-slate-900">
                    Thank you!
                  </h3>

                  <p className="mt-3 text-sm text-slate-600">
                    We&apos;ve received your message and will connect with you shortly.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData(initialFormData);
                      setErrors({});
                    }}
                    className="mt-6 rounded-2xl bg-[#7A330F] px-5 py-3 text-white transition hover:bg-[#5f2609]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-2xl">
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-slate-900">
                      Send us a message
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Fill out the form and we&apos;ll respond as soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`${inputClassName} ${errors.name ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-orange-100"}`}
                      />
                      {errors.name ? <p className="mt-2 text-sm text-red-500">{errors.name}</p> : null}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className={`${inputClassName} ${errors.email ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-orange-100"}`}
                        />
                        {errors.email ? <p className="mt-2 text-sm text-red-500">{errors.email}</p> : null}
                      </div>

                      <div>
                        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
                          Contact Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile number"
                          className={`${inputClassName} ${errors.phone ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-orange-100"}`}
                        />
                        {errors.phone ? <p className="mt-2 text-sm text-red-500">{errors.phone}</p> : null}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        className={`${inputClassName} min-h-[140px] resize-none ${errors.message ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-orange-100"}`}
                      />
                      {errors.message ? <p className="mt-2 text-sm text-red-500">{errors.message}</p> : null}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`inline-flex w-full items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition ${loading
                          ? "cursor-not-allowed bg-gray-400"
                          : "bg-[#7A330F] hover:bg-[#5f2609]"
                        }`}
                    >
                      {loading ? "Sending message..." : "Send Message"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
