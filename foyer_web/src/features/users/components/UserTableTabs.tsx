"use client";

import { useState } from "react";
import { User } from "@/types";
import { DataTable, Column } from "@/components/shared/DataTable";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ShieldCheck, Shield, UserCheck, ShieldAlert, KeyRound } from "lucide-react";

interface UserTableTabsProps {
  users: User[];
  isLoading?: boolean;
}

export function UserTableTabs({ users, isLoading }: UserTableTabsProps) {
  const [activeTab, setActiveTab] = useState<"all" | "super_admins" | "admins" | "residents" | "guards">("super_admins");

  const superAdminUsers = users.filter((u) => u.roles.includes("super_admin"));
  const adminUsers = users.filter(
    (u) => u.roles.includes("admin") || u.roles.includes("owner")
  );
  const residentUsers = users.filter((u) => u.roles.includes("resident"));
  const guardUsers = users.filter((u) => u.roles.includes("guard"));

  const userColumns: Column<User>[] = [
    {
      header: "Unique ID",
      accessorKey: "uniqueId",
      cell: (user) => (
        <span className="font-mono text-xs font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
          #{user.uniqueId}
        </span>
      ),
    },
    {
      header: "User Details",
      cell: (user) => (
        <div>
          <p className="font-medium text-slate-100">{user.name}</p>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (user) => <span className="font-mono text-xs text-slate-300">{user.phone}</span>,
    },
    {
      header: "Assigned Roles",
      cell: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.map((r) => (
            <RoleBadge key={r} role={r} />
          ))}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (user) => <StatusBadge status={user.status} />,
    },
  ];

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 md:w-auto">
          <TabsTrigger value="super_admins" className="gap-2">
            <Shield className="h-4 w-4 text-purple-400" /> Super Admins ({superAdminUsers.length})
          </TabsTrigger>
          <TabsTrigger value="admins" className="gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-400" /> Admins & Owners ({adminUsers.length})
          </TabsTrigger>
          <TabsTrigger value="residents" className="gap-2">
            <UserCheck className="h-4 w-4 text-emerald-400" /> Residents ({residentUsers.length})
          </TabsTrigger>
          <TabsTrigger value="guards" className="gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" /> Guards ({guardUsers.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <KeyRound className="h-4 w-4 text-slate-400" /> All ({users.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="super_admins">
          <DataTable
            data={superAdminUsers}
            columns={userColumns}
            isLoading={isLoading}
            searchPlaceholder="Search super admins by name, email, or unique ID..."
            searchFilterKeys={["name", "email", "uniqueId", "phone"]}
            emptyTitle="No Super Admins Found"
            emptyDescription="No super admins have been created yet. Society owners can onboard super admins."
          />
        </TabsContent>

        <TabsContent value="admins">
          <DataTable
            data={adminUsers}
            columns={userColumns}
            isLoading={isLoading}
            searchPlaceholder="Search admins by name, email, or unique ID..."
            searchFilterKeys={["name", "email", "uniqueId", "phone"]}
            emptyTitle="No Society Admins Found"
            emptyDescription="No society administrators or owners have been added yet."
          />
        </TabsContent>

        <TabsContent value="residents">
          <DataTable
            data={residentUsers}
            columns={userColumns}
            isLoading={isLoading}
            searchPlaceholder="Search residents by name, email, or unique ID..."
            searchFilterKeys={["name", "email", "uniqueId", "phone"]}
            emptyTitle="No Residents Found"
            emptyDescription="No residents have been onboarded yet."
          />
        </TabsContent>

        <TabsContent value="guards">
          <DataTable
            data={guardUsers}
            columns={userColumns}
            isLoading={isLoading}
            searchPlaceholder="Search guards by name, email, or unique ID..."
            searchFilterKeys={["name", "email", "uniqueId", "phone"]}
            emptyTitle="No Security Guards Found"
            emptyDescription="No security guards have been added to this society."
          />
        </TabsContent>

        <TabsContent value="all">
          <DataTable
            data={users}
            columns={userColumns}
            isLoading={isLoading}
            searchPlaceholder="Search all society members..."
            searchFilterKeys={["name", "email", "uniqueId", "phone"]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
