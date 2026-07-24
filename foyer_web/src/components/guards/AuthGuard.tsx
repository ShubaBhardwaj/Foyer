"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isClerkLoaded, isSignedIn, isLoading, isError, user } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (isClerkLoaded && !isSignedIn) {
      router.push("/login");
    }
  }, [isClerkLoaded, isSignedIn, router]);

  useEffect(() => {
    // User is signed in with Clerk but has no linked account in MongoDB
    // This happens for new owners who haven't registered a society yet
    if (isClerkLoaded && isSignedIn && isError && !isLoading) {
      router.push("/login");
    }
  }, [isClerkLoaded, isSignedIn, isError, isLoading, router]);

  if (!isClerkLoaded || isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-sm font-medium text-slate-400">Authenticating Foyer Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-sm font-medium text-slate-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

