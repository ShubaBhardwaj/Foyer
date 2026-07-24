"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import { RegisterSocietyForm } from "@/features/society/components/RegisterSocietyForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Building2, MapPin, Hash, CheckCircle } from "lucide-react";

export default function SocietyPage() {
  const { society, isLoading } = useAuthUser();

  if (isLoading) return null;

  if (!society) {
    return <RegisterSocietyForm />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-purple-400" /> Society Profile
          </h1>
          <p className="text-xs text-slate-400">
            Registered details for {society.name}
          </p>
        </div>
      </div>

      <Card className="border-slate-800 bg-slate-900/90 shadow-2xl max-w-3xl">
        <CardHeader className="border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">{society.name}</CardTitle>
                <CardDescription>Code: {society.societyCode}</CardDescription>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle className="h-3.5 w-3.5" /> {society.status.toUpperCase()}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-purple-400" /> Society Code
              </span>
              <p className="font-mono text-xl font-bold text-purple-300">{society.societyCode}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-indigo-400" /> City & State
              </span>
              <p className="text-base font-semibold text-slate-200">{society.city}, {society.state}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Address Line</span>
            <p className="text-sm text-slate-300">{society.address}</p>
            <p className="text-xs text-slate-500 font-mono">Pincode: {society.pincode}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
