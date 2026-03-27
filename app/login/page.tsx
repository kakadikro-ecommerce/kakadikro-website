import type { Metadata } from "next";
import { Suspense } from "react";

import LoginForm from "../../components/auth/LoginForm";
import { buildMetadata } from "@/app/seo";

export const metadata: Metadata = buildMetadata({
  title: "Login",
  description: "Sign in to your Kaka Dikro account to manage orders and profile details.",
  path: "/login",
  index: false,
});

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
