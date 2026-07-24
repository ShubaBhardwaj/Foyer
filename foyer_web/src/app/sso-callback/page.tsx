"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-100">
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
