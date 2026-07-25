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
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[var(--outline)]/30 bg-[var(--surface)] p-4 text-[var(--on-surface)] backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-[var(--outline)]/30 pb-4 pt-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-[var(--on-primary)] shadow-lg shadow-[var(--primary)]/20">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-[var(--on-surface)] flex items-center gap-1.5">
            FOYER <span className="text-[10px] font-mono font-semibold text-[var(--tertiary)] bg-[var(--tertiary-container)]/50 px-1.5 py-0.5 rounded border border-[var(--tertiary)]/30">PRO</span>
          </h1>
          <p className="text-xs text-[var(--on-surface)]/60 truncate max-w-[130px]">
            {society?.name || "Society Platform"}
          </p>
        </div>
      </div>

      {/* Navigation Scroll Container */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-[var(--outline)]">
        {/* Main Section */}
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--on-surface)]/50">
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
                      ? "bg-[var(--primary-container)]/40 text-[var(--primary)] border border-[var(--primary)]/30 shadow-sm"
                      : "text-[var(--on-surface)]/70 hover:bg-[var(--surface-variant)]/60 hover:text-[var(--on-surface)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4", isActive ? "text-[var(--primary)]" : "text-[var(--on-surface)]/50 group-hover:text-[var(--on-surface)]")} />
                    <span>{item.title}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-[var(--primary)]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Creation Section */}
        {createItems.length > 0 && (
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--on-surface)]/50">
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
                        ? "bg-[var(--secondary-container)]/40 text-[var(--on-secondary-container)] border border-[var(--secondary)]/30 shadow-sm"
                        : "text-[var(--on-surface)]/70 hover:bg-[var(--surface-variant)]/60 hover:text-[var(--on-surface)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("h-4 w-4", isActive ? "text-[var(--primary)]" : "text-[var(--on-surface)]/50 group-hover:text-[var(--on-surface)]")} />
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
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--on-surface)]/50">
              Modules
            </p>
            <Sparkles className="h-3 w-3 text-[var(--tertiary)] animate-pulse" />
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
                      ? "bg-[var(--surface-variant)] text-[var(--on-surface)]"
                      : "text-[var(--on-surface)]/60 hover:bg-[var(--surface-variant)]/60 hover:text-[var(--on-surface)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[var(--on-surface)]/40 group-hover:text-[var(--on-surface)]/70" />
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[9px] uppercase font-mono text-[var(--on-surface)]/50 bg-[var(--surface-variant)]/50 px-1.5 py-0.5 rounded border border-[var(--outline)]/30">
                    Soon
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Settings Section */}
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--on-surface)]/50">
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
                      ? "bg-[var(--primary-container)]/40 text-[var(--primary)] border border-[var(--primary)]/30"
                      : "text-[var(--on-surface)]/70 hover:bg-[var(--surface-variant)]/60 hover:text-[var(--on-surface)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[var(--on-surface)]/50 group-hover:text-[var(--on-surface)]" />
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
        <div className="border-t border-[var(--outline)]/30 pt-3 text-[11px] text-[var(--on-surface)]/70">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[var(--primary)] font-semibold">{society.societyCode}</span>
            <span className="capitalize text-[var(--success)]">{society.status}</span>
          </div>
          <p className="truncate text-[var(--on-surface)]/50 mt-0.5">{society.city}, {society.state}</p>
        </div>
      )}
    </aside>
  );
}

