"use client";

import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-400">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Building2 className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold">About Foyer Platform</h1>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          Foyer is an enterprise-grade Society Management Platform designed to streamline operations across residential gated communities, towers, and housing societies. By pairing Clerk authentication with strict MongoDB backend authorization, Foyer ensures total data security, multi-role governance, and dynamic structural expansion.
        </p>
      </div>
    </div>
  );
}
