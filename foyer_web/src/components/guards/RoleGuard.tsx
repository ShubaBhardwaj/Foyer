"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import { Role } from "@/types";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { roles, isLoading } = useAuthUser();

  if (isLoading) {
    return null;
  }

  const hasAllowedRole = roles.some((role) => allowedRoles.includes(role));

  if (!hasAllowedRole) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-red-500/10 p-4 text-red-500 dark:bg-red-500/20">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Access Restricted
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Your assigned role(s) <span className="font-semibold text-purple-500">[{roles.join(", ")}]</span> do not have permission to view this section.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
