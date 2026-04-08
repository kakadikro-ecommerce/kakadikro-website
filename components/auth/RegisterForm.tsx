"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { registerSchema, type RegisterInput } from "../../lib/validations/auth";
import AuthPageGuard from "./AuthPageGuard";
import Button from "../ui/Button";
import InputField from "../ui/Input";
import { showAlert } from "../ui/alert";
import { registerUser } from "@/redux/api/userApi";

function RegisterContent() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerUser(data);

      showAlert({
        type: "success",
        message: "Registration successful! Please login.",
      });

      reset();

      setTimeout(() => {
        router.replace(`/login?email=${encodeURIComponent(data.email)}`);
      }, 1500);
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof error.response === "object" &&
          error.response !== null &&
          "data" in error.response &&
          typeof error.response.data === "object" &&
          error.response.data !== null &&
          "message" in error.response.data &&
          typeof error.response.data.message === "string"
          ? error.response.data.message
          : error instanceof Error
            ? error.message
            : "Registration failed.";

      showAlert({
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <div className="w-full max-w-sm px-1 sm:px-2">
      <div className="mb-5 text-center md:mb-6 md:text-left">
        <h1 className="font-brand-serif text-2xl tracking-tight text-stone-900 sm:text-3xl md:text-3xl">
          Join the family
        </h1>
        <p className="text-stone-400 text-[10px] tracking-wide sm:text-xs">
          Enter your details to create an account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 sm:space-y-3.5 md:space-y-4"
      >
        <InputField
          label="Full Name"
          placeholder="Your Name"
          {...register("name")}
          error={errors.name?.message}
        />

        <InputField
          label="Email Address"
          type="email"
          placeholder="email@example.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <InputField
          label="Password"
          type="password"
          placeholder="........"
          {...register("password")}
          error={errors.password?.message}
        />

        <div className="pt-1">
          <Button text="Register Now" type="submit" />
        </div>
      </form>

      <div className="mt-4 pt-1 text-center md:text-left">
        <p className="font-brand-serif text-xs font-medium tracking-wide text-stone-500 sm:text-sm">
          Member already?{" "}
          <Link
            href="/login"
            className="ml-2 border-b-2 border-orange-900/20 pb-0.5 font-bold italic text-orange-900 transition-all hover:border-orange-900"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterForm() {
  return (
    <AuthPageGuard>
      <div className="min-h-screen w-full overflow-x-hidden bg-white px-3 py-4 antialiased sm:px-4 sm:py-6 md:flex md:items-center md:justify-center md:p-6">
        <div className="mx-auto my-0 flex w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-[0_18px_45px_-24px_rgba(0,0,0,0.22)] sm:max-w-[520px] sm:rounded-3xl md:max-w-6xl md:flex-row md:rounded-[40px] md:shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)]">
          <div className="relative hidden w-full overflow-hidden border-r border-stone-50 bg-[#faf7f2] md:flex md:min-h-[620px] md:w-1/2 md:items-center md:justify-center md:p-10 lg:p-12 xl:p-16">
            <Image
              src="/assets/register.webp"
              alt="Register background"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex w-full items-center justify-center bg-white px-4 py-8 sm:px-6 sm:py-9 md:w-1/2 md:px-8 md:py-10 lg:px-12">
            <RegisterContent />
          </div>
        </div>
      </div>
    </AuthPageGuard>
  );
}
