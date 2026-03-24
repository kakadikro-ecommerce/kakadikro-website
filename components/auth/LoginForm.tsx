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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setUser } from "@/redux/slice/userSlice";

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

  const onSubmit = (data: LoginInput) => {
    dispatch(
      setUser({
        email: data.email,
      })
    );

    showAlert({
      type: "success",
      message: `Welcome back! Rasoi ma umeryo asli swaad!`,
    });

    reset();
    const redirectPath = searchParams.get("redirect") || "/";
    router.push(redirectPath);
  };

  return (
    <div className="w-full max-w-sm px-4 sm:px-6">
      <div className="mb-6 sm:mb-8 text-center md:text-left">
        <h1 className="font-brand-serif text-2xl sm:text-3xl md:text-4xl text-stone-900 tracking-tight mb-2">
          Sign In
        </h1>
        <p className="text-[#7A330F] text-xs sm:text-sm font-medium mb-1">
          Rasoi ma umeryo asli swaad!
        </p>
        <p className="text-stone-400 text-[10px] sm:text-xs tracking-wide">
          Welcome back! Please enter your details.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 sm:space-y-4 md:space-y-5"
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
        <div className="pt-2 sm:pt-1">
          <Button text="Sign In" type="submit" />
        </div>
      </form>

      <div className="mt-4 sm:mt-1 pt-2 sm:pt-1 text-center">
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
    <div className="min-h-screen w-full flex items-center justify-center bg-white antialiased overflow-x-hidden p-3 sm:p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={2000} theme="light" />

      <div className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-6xl md:h-[89vh] bg-white rounded-2xl sm:rounded-3xl md:rounded-[40px] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-stone-100">
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-white min-h-[500px] md:min-h-full">
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

        <div
          className="hidden md:flex w-full md:w-1/2 p-8 lg:p-12 xl:p-20 flex-col items-center justify-center text-center relative bg-[#faf7f2] border-l border-stone-50"
          style={{
            backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')`,
          }}
        >
          <div className="absolute inset-0 bg-[#F4EBD0]/10 pointer-events-none" />
          <div className="relative z-10 flex justify-center mb-6">
            <div className="relative h-20 w-32 lg:h-28 lg:w-44 xl:h-42 xl:w-48">
              <Image
                src="/kde-logo-1.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="relative z-10">
            <h2 className="font-brand-serif text-2xl lg:text-3xl xl:text-4xl text-stone-900 leading-tight tracking-tight mb-6">
              Swad ni <br />
              <span className="italic font-normal text-[#7A330F] block mt-1">
                Asli Pehchaan.
              </span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
