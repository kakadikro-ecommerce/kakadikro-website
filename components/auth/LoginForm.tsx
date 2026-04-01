"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../ui/Input";
import Button from "../ui/Button";
import Link from "next/link";
import Image from "next/image";
import { loginSchema, LoginInput } from "../../lib/validations/auth";
import { showAlert } from "../ui/alert";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setAuthSession } from "@/redux/slice/userSlice";
import { loginUser } from "@/redux/api/userApi";
import { setAccessToken, setStoredUser } from "@/lib/auth";
import AuthPageGuard from "./AuthPageGuard";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) setValue("email", emailFromUrl);
  }, [searchParams, setValue]);

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await loginUser(data);

      const userData = {
        _id: response?.data?.user?._id || response?.data?.user?.id,
        id: response?.data?.user?.id || response?.data?.user?._id,
        name: response?.data?.user?.name,
        email: response?.data?.user?.email,
        role: response?.data?.user?.role,
      };
      const accessToken = response?.data?.accessToken;

      if (!accessToken || !userData.email) {
        throw new Error("Invalid login response");
      }

      setAccessToken(accessToken);
      setStoredUser(userData);

      dispatch(setAuthSession({ user: userData, accessToken }));

      showAlert({
        type: "success",
        message: "Welcome back!",
      });

      reset();

      const redirectPath = searchParams.get("redirect") || "/";
      router.replace(redirectPath);
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
            : "Login failed. Please check your credentials.";

      showAlert({
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <div className="w-full max-w-sm px-1 sm:px-2">
      <div className="mb-5 text-center md:mb-6 md:text-left">
        <h1 className="font-brand-serif text-2xl sm:text-3xl md:text-4xl text-stone-900 tracking-tight mb-2">
          Welcome back!
        </h1>
        <p className="text-gray-900 text-[10px] sm:text-xs tracking-wide">
          Please enter your details.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 sm:space-y-3.5 md:space-y-4"
      >
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
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />
        <div className="pt-1">
          <Button text="Sign In" type="submit" />
        </div>
      </form>

      <div className="mt-4 pt-1 text-center md:text-left">
        <p className="font-brand-serif text-xs sm:text-sm tracking-wide text-stone-500 font-medium">
          New here?{" "}
          <Link
            href="/register"
            className="text-[#7A330F] font-bold border-b-2 border-[#7A330F]/20 hover:border-[#7A330F] pb-0.5 ml-2 transition-all italic"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginForm() {
  return (
    <AuthPageGuard>
      <div className="min-h-screen w-full bg-white antialiased overflow-x-hidden px-3 py-4 sm:px-4 sm:py-6 md:flex md:items-center md:justify-center md:p-6">
        <div className="mx-auto flex w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-[0_18px_45px_-24px_rgba(0,0,0,0.22)] sm:max-w-[520px] sm:rounded-3xl md:max-w-6xl md:flex-row md:rounded-[40px] md:shadow-2xl">
          <div className="flex w-full items-center justify-center bg-white px-4 py-8 sm:px-6 sm:py-9 md:w-1/2 md:px-8 md:py-10 lg:px-12">
            <Suspense
              fallback={
                <div className="text-stone-400 animate-pulse text-xs">
                  Loading...
                </div>
              }
            >
              <LoginContent />
            </Suspense>
          </div>

          <div className="relative hidden w-full overflow-hidden border-l border-stone-50 bg-[#faf7f2] md:flex md:w-1/2 md:min-h-[620px] md:items-center md:justify-center md:p-10 lg:p-12 xl:p-16">
            <Image
              src="/assets/login.webp"
              alt="Login background"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </AuthPageGuard>
  );
}
