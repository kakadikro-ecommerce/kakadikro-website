import type { Metadata } from "next";
import { Suspense } from "react";

import RegisterForm from "@/components/auth/RegisterForm";
import { buildMetadata } from "@/app/seo";

export const metadata: Metadata = buildMetadata({
  title: "Create Account",
  description: "Create your Kaka Dikro account for faster checkout, order tracking, and saved details.",
  path: "/register",
  index: false,
});

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
