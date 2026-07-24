"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PrivacyPage() {
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
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          At Foyer, privacy and security are fundamental. User identity authentication is handled securely through Clerk, and profile authorization is managed in isolated MongoDB databases. Email addresses and contact details are never shared with third parties.
        </p>
      </div>
    </div>
  );
}
