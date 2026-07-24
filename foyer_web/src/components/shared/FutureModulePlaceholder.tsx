"use client";

import { LucideIcon, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface FutureModulePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function FutureModulePlaceholder({
  title,
  description,
  icon: Icon,
}: FutureModulePlaceholderProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center backdrop-blur-sm space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 ring-8 ring-purple-500/5 border border-purple-500/20">
        <Icon className="h-8 w-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold text-purple-300">
          <Sparkles className="h-3 w-3" /> Future Module Roadmap
        </div>
        <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>

      <Link href="/dashboard">
        <Button variant="outline" size="sm" className="gap-2 border-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
