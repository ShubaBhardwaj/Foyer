"use client";

import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-slate-950 p-4">
      <LoginForm />
    </div>
  );
}
