"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/services/api/users.api";
import { queryKeys } from "@/constants/queryKeys";
import { RoleGuard } from "@/components/guards/RoleGuard";
import { UserTableTabs } from "@/features/users/components/UserTableTabs";
import { Button } from "@/components/ui/Button";
import { Users, UserPlus } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const { roles, society } = useAuthUser();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: async () => {
      const res = await usersApi.getUsers();
      return res.data;
    },
    enabled: !!society,
  });

  const users = data?.users || [];

  return (
    <RoleGuard allowedRoles={["owner", "super_admin", "admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-400" /> User Management
            </h1>
            <p className="text-xs text-slate-400">
              Governance portal for administrators, residents, and security guards
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {roles.includes("owner") && (
              <Link href="/users/create/super-admin">
                <Button size="sm" className="gap-2 text-xs bg-purple-600 hover:bg-purple-500">
                  <UserPlus className="h-4 w-4" /> Create Super Admin
                </Button>
              </Link>
            )}

            {roles.includes("super_admin") && (
              <Link href="/users/create/admin">
                <Button size="sm" className="gap-2 text-xs bg-indigo-600 hover:bg-indigo-500">
                  <UserPlus className="h-4 w-4" /> Create Admin
                </Button>
              </Link>
            )}

            {(roles.includes("super_admin") || roles.includes("admin")) && (
              <>
                <Link href="/users/create/resident">
                  <Button size="sm" className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-500">
                    <UserPlus className="h-4 w-4" /> Create Resident
                  </Button>
                </Link>

                <Link href="/users/create/guard">
                  <Button size="sm" className="gap-2 text-xs bg-amber-600 hover:bg-amber-500">
                    <UserPlus className="h-4 w-4" /> Create Guard
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <UserTableTabs users={users} isLoading={isLoading} />
      </div>
    </RoleGuard>
  );
}
