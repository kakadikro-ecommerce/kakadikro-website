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
  const { currentUser, accessToken, isAuthReady, isAuthChecking } = useAppSelector(
    (state) => state.user
  );
  const isAuthenticated = !!currentUser && !!accessToken;

  useEffect(() => {
    if (isAuthReady && !isAuthChecking && isAuthenticated) {
      const redirectPath = searchParams.get("redirect") || "/";
      router.replace(redirectPath);
    }
  }, [isAuthenticated, isAuthChecking, isAuthReady, router, searchParams]);

  if (!isAuthReady || isAuthChecking || isAuthenticated) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-stone-400">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
