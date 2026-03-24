"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import InputField from "../ui/Input";
import Button from "../ui/Button";
import { registerSchema, RegisterInput } from "../../lib/validations/auth";

import { showAlert } from "../ui/alert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegisterContent() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = (data: RegisterInput) => {
    showAlert({
      type: "success",
      message: "Welcome to the family! Registration successful. 🎉",
    });

    setTimeout(() => {
      router.push(`/login?email=${encodeURIComponent(data.email)}`);
    }, 3890);
  };

  return (
    <div className="w-full max-w-sm px-4 sm:px-6">
      <div className="mb-6 sm:mb-2 text-center md:text-left">
        <h1 className="font-brand-serif text-2xl sm:text-3xl md:text-3xl text-stone-900 tracking-tight -mb-1">
          Join the family
        </h1>
        <p className="text-stone-400 text-[10px] sm:text-xs tracking-wide">
          Enter your details to create an account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 md:space-y-4">
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
          placeholder="••••••••" 
          {...register("password")}
          error={errors.password?.message}
        />

        <div className="pt-2 sm:pt-1">
          <Button text="Register Now" type="submit" />
        </div>
      </form>

      <div className="mt-4 sm:mt-1 pt-1 sm:pt-1 text-center">
        <p className="font-brand-serif text-xs sm:text-sm tracking-wide text-stone-500 font-medium">
          Member already?{" "}
          <Link
            href="/login"
            className="text-orange-900 font-bold border-b-2 border-orange-900/20 hover:border-orange-900 pb-0.5 ml-2 transition-all italic"
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
    <div className="min-h-screen w-full flex items-center justify-center bg-white antialiased overflow-x-hidden p-0">
      <ToastContainer theme="light" />
      <div className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-6xl md:h-[90vh] bg-white rounded-2xl sm:rounded-3xl md:rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] md:shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden border border-stone-100 my-4 sm:my-6 md:my-0">
        
        <div
          className="hidden md:flex w-full md:w-1/2 p-8 lg:p-12 xl:p-20 flex-col items-center justify-center text-center relative bg-[#faf7f2] border-r border-stone-50"
          style={{
            backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')`,
          }}
        >
          <div className="absolute inset-0 bg-[#F4EBD0]/10 pointer-events-none" />

          <div className="relative z-10 flex justify-center mb-6 lg:mb-8">
            <div className="relative h-20 w-32 lg:h-28 lg:w-44 xl:h-49 xl:w-48">
              <Image
                src="/kde-logo-1.png"
                alt="Kaka Dikro Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="relative z-10">
            <h2 className="font-brand-serif text-2xl lg:text-3xl xl:text-4xl text-stone-900 leading-tight tracking-tight mb-6 lg:mb-8">
              Swad ni <br />
              <span className="italic font-normal text-[#7A2F10] block mt-1">
                Asli Pehchaan.
              </span>
            </h2>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-white min-h-[500px] sm:min-h-[550px] md:min-h-full">
           <RegisterContent />
        </div>
      </div>
    </div>
  );
}