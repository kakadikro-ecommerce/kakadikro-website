"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAppSelector } from "@/hooks/useAppSelector";

interface AuthPageGuardProps {
  children: React.ReactNode;
}

export default function AuthPageGuard({ children }: AuthPageGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const hasStoredUser =
    typeof window !== "undefined" &&
    !!window.localStorage.getItem("kd-user");
  const isAuthenticated = !!currentUser?.token || hasStoredUser;

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = searchParams.get("redirect") || "/";
      router.replace(redirectPath);
    }
  }, [isAuthenticated, router, searchParams]);

  if (isAuthenticated) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-stone-400">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
