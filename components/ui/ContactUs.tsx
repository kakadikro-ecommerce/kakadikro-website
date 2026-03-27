"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showAlert } from "@/components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { submitContact } from "@/redux/slice/contactSlice";
import { RootState } from "@/redux/store";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactUs() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<ContactFormErrors>({});

  const validateForm = (values: ContactFormData) => {
    const nextErrors: ContactFormErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;

    if (!values.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!values.phone.trim()) {
      nextErrors.phone = "Contact number is required.";
    } else if (!phonePattern.test(values.phone.trim())) {
      nextErrors.phone = "Contact number must be exactly 10 digits.";
    }

    if (!values.message.trim()) {
      nextErrors.message = "Message is required.";
    }

    return nextErrors;
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    const nextValue =
      name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const dispatch = useDispatch<any>();


  const { loading } = useSelector((state: RootState) => state.contact);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showAlert({
        type: "error",
        message: "Please correct the highlighted fields.",
      });
      return;
    }

    try {
      await dispatch(submitContact(formData)).unwrap();

      showAlert({
        type: "success",
        message: "Message sent successfully!",
      });

      setFormData(initialFormData);
      setErrors({});
    } catch (error: any) {
      showAlert({
        type: "error",
        message: error || "Failed to send message",
      });
    }
  };

  const inputClassName =
    "w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100";


  return (
    <section className="py-16 sm:py-20">
      <ToastContainer position="top-right" autoClose={2500} theme="light" />

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

        <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_28px_80px_-38px_rgba(194,65,12,0.35)] lg:grid-cols-[1fr_1.05fr]">
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

                <div className="flex items-start gap-4 p-4 ">
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
            <div className="rounded-[1.75rem] p-6 sm:p-8">
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
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`${inputClassName} ${errors.name
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-orange-100"
                      }`}
                  />
                  {errors.name ? (
                    <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                  ) : null}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`${inputClassName} ${errors.email
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-orange-100"
                        }`}
                    />
                    {errors.email ? (
                      <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
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
                      className={`${inputClassName} ${errors.phone
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-orange-100"
                        }`}
                    />
                    {errors.phone ? (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.phone}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className={`${inputClassName} min-h-[140px] resize-none ${errors.message
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-orange-100"
                      }`}
                  />
                  {errors.message ? (
                    <p className="mt-2 text-sm text-red-500">{errors.message}</p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex w-full items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition
                  ${loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#7A330F] hover:bg-[#5f2609]"
                    }`}
                >
                  {loading ? "Sending message..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
