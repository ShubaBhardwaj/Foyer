"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { User, Mail, Phone, KeyRound, Building2 } from "lucide-react";

export default function ProfilePage() {
  const { user, society, primaryRole } = useAuthUser();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <User className="h-6 w-6 text-purple-400" /> User Profile
        </h1>
        <p className="text-xs text-slate-400">
          Your authenticated Foyer profile details
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-900/90 shadow-2xl">
        <CardHeader className="border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <CardTitle className="text-xl">{user?.name}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
            {primaryRole && <RoleBadge role={primaryRole} />}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-purple-400" /> 6-Char Unique ID
              </span>
              <p className="font-mono text-xl font-bold text-purple-300">#{user?.uniqueId}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-indigo-400" /> Contact Phone
              </span>
              <p className="font-mono text-base font-semibold text-slate-200">{user?.phone || "N/A"}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-emerald-400" /> Associated Society
            </span>
            {society ? (
              <p className="text-sm font-semibold text-slate-100">
                {society.name} ({society.societyCode}) • {society.city}, {society.state}
              </p>
            ) : (
              <p className="text-xs text-slate-500">No society linked yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
