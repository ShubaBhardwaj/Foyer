"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { structureApi } from "@/services/api/structure.api";
import { queryKeys } from "@/constants/queryKeys";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Building2, Layers, Home, Users, UserPlus, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, society, primaryRole, roles } = useAuthUser();

  const { data: structureData, isLoading: isStructureLoading } = useQuery({
    queryKey: queryKeys.society.structure,
    queryFn: async () => {
      const res = await structureApi.get();
      return res.data;
    },
    enabled: !!society,
  });

  const towers = structureData?.towers || structureData?.structure || [];
  const flats = structureData?.flats || towers.flatMap((t: any) => t.flats || []) || [];
  const totalFlats = flats.length;
  const occupiedFlats = flats.filter((f) => f.occupied).length;
  const occupancyRate = totalFlats > 0 ? Math.round((occupiedFlats / totalFlats) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner Card */}
      <Card className="relative overflow-hidden border-purple-500/20 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 shadow-2xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)] pointer-events-none" />
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-white">
                Welcome back, {user?.name || "Administrator"}
              </span>
              {primaryRole && <RoleBadge role={primaryRole} />}
            </div>
            <p className="text-sm text-slate-400 max-w-xl">
              {society
                ? `Managing ${society.name} (${society.societyCode}) • ${society.city}, ${society.state}`
                : "Your account is active. Complete your society registration to begin structure governance."}
            </p>
          </div>

          {!society ? (
            <Link href="/society/register">
              <Button size="lg" className="gap-2 shadow-xl shadow-purple-900/40">
                Register Society <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/structure">
                <Button variant="outline" size="sm" className="gap-2 border-slate-700 bg-slate-950">
                  <Layers className="h-4 w-4 text-purple-400" /> Manage Structure
                </Button>
              </Link>
              {roles.includes("owner") && (
                <Link href="/users/create/super-admin">
                  <Button size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" /> Create Super Admin
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Towers</span>
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400 border border-purple-500/20">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-100">{towers.length}</p>
          <p className="text-[11px] text-slate-500">Active tower structures</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Flats</span>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400 border border-indigo-500/20">
              <Home className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-100">{totalFlats}</p>
          <p className="text-[11px] text-slate-500">Configured residence units</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Occupancy Rate</span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-100">{occupancyRate}%</p>
          <p className="text-[11px] text-slate-500">{occupiedFlats} of {totalFlats} flats occupied</p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Unique ID</span>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-purple-400">#{user?.uniqueId}</p>
          <p className="text-[11px] text-slate-500">Mongoose authorization ID</p>
        </Card>
      </div>

      {/* Quick Action Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" /> User Governance Quick Actions
            </CardTitle>
            <CardDescription>Onboard administrators, residents, or security guards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {roles.includes("owner") && (
              <Link href="/users/create/super-admin" className="block">
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-purple-500/40 transition-all">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Create Super Admin</p>
                    <p className="text-xs text-slate-500">Owner permission reserved action</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-purple-400" />
                </div>
              </Link>
            )}

            {roles.includes("super_admin") && (
              <Link href="/users/create/admin" className="block">
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-indigo-500/40 transition-all">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Create Society Admin</p>
                    <p className="text-xs text-slate-500">Super Admin action</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-indigo-400" />
                </div>
              </Link>
            )}

            {(roles.includes("super_admin") || roles.includes("admin")) && (
              <>
                <Link href="/users/create/resident" className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-emerald-500/40 transition-all">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Create Resident</p>
                      <p className="text-xs text-slate-500">Requires Tower + Flat allocation</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-emerald-400" />
                  </div>
                </Link>

                <Link href="/users/create/guard" className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-amber-500/40 transition-all">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">Create Security Guard</p>
                      <p className="text-xs text-slate-500">Onboard gate guards</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-amber-400" />
                  </div>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-400" /> Society Profile
            </CardTitle>
            <CardDescription>Current registered society details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {society ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-400">Society Name</span>
                  <span className="font-bold text-slate-100">{society.name}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-400">Society Code</span>
                  <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {society.societyCode}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-400">Address</span>
                  <span className="text-xs text-slate-300 truncate max-w-[200px]">{society.address}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">City, State</span>
                  <span className="text-slate-300">{society.city}, {society.state} - {society.pincode}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500">
                No society registered for this user yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
