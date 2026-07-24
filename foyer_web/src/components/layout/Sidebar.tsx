"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MAIN_NAV_ITEMS,
  USER_CREATE_NAV_ITEMS,
  FUTURE_MODULE_NAV_ITEMS,
  SETTINGS_NAV_ITEMS,
} from "@/constants/navigation";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Building2, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const { roles, society } = useAuthUser();

  const filterNavItems = (items: typeof MAIN_NAV_ITEMS) => {
    return items.filter((item) => {
      if (!item.roles) return true;
      return item.roles.some((role) => roles.includes(role));
    });
  };

  const mainItems = filterNavItems(MAIN_NAV_ITEMS);
  const createItems = filterNavItems(USER_CREATE_NAV_ITEMS);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800/80 bg-slate-950/95 p-4 text-slate-100 backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4 pt-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
            FOYER <span className="text-[10px] font-mono font-normal text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">PRO</span>
          </h1>
          <p className="text-xs text-slate-400 truncate max-w-[130px]">
            {society?.name || "Society Platform"}
          </p>
        </div>
      </div>

      {/* Navigation Scroll Container */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Main Section */}
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Main Management
          </p>
          <nav className="mt-2 space-y-1">
            {mainItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all",
                    isActive
                      ? "bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4", isActive ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300")} />
                    <span>{item.title}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-purple-400" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Creation Section */}
        {createItems.length > 0 && (
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              User Actions
            </p>
            <nav className="mt-2 space-y-1">
              {createItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all",
                      isActive
                        ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("h-4 w-4", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
                      <span>{item.title}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Future Modules Section */}
        <div>
          <div className="px-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Modules
            </p>
            <Sparkles className="h-3 w-3 text-purple-400 animate-pulse" />
          </div>
          <nav className="mt-2 space-y-1">
            {FUTURE_MODULE_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all opacity-80 hover:opacity-100",
                    isActive
                      ? "bg-slate-800 text-slate-200"
                      : "text-slate-500 hover:bg-slate-900 hover:text-slate-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-slate-500 group-hover:text-slate-400" />
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[9px] uppercase font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    Soon
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Settings Section */}
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Account
          </p>
          <nav className="mt-2 space-y-1">
            {SETTINGS_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all",
                    isActive
                      ? "bg-purple-600/15 text-purple-300 border border-purple-500/30"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-slate-500 group-hover:text-slate-300" />
                    <span>{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Society Quick Footer */}
      {society && (
        <div className="border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span className="font-mono text-purple-400 font-semibold">{society.societyCode}</span>
            <span className="capitalize text-emerald-400">{society.status}</span>
          </div>
          <p className="truncate text-slate-500 mt-0.5">{society.city}, {society.state}</p>
        </div>
      )}
    </aside>
  );
}
