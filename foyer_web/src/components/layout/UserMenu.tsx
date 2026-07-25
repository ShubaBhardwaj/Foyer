"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useAuthUser } from "@/hooks/useAuthUser";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { LogOut, User as UserIcon, Building, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const { user, primaryRole, society } = useAuthUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.name || clerkUser?.fullName || clerkUser?.primaryEmailAddress?.emailAddress || "User";
  const displayEmail = user?.email || clerkUser?.primaryEmailAddress?.emailAddress || "";
  const avatarUrl = clerkUser?.imageUrl;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full p-1 transition-colors hover:bg-[var(--surface-variant)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-8 w-8 rounded-full border border-[var(--outline)]/40 object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] font-semibold text-[var(--on-primary)]">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="hidden text-left md:block">
          <p className="text-xs font-semibold text-[var(--on-surface)]">{displayName}</p>
          <p className="text-[10px] text-[var(--on-surface)]/60">Unique ID: {user?.uniqueId || "N/A"}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[var(--outline)]/40 bg-[var(--surface)] p-2 text-[var(--on-surface)] shadow-2xl backdrop-blur-md z-50 animate-in fade-in-0 zoom-in-95">
          <div className="border-b border-[var(--outline)]/30 px-3 py-2.5">
            <p className="text-sm font-semibold text-[var(--on-surface)]">{displayName}</p>
            <p className="text-xs text-[var(--on-surface)]/60 truncate">{displayEmail}</p>
            <div className="mt-2 flex items-center justify-between">
              {primaryRole && <RoleBadge role={primaryRole} />}
              <span className="text-[10px] font-mono font-semibold text-[var(--tertiary)] bg-[var(--tertiary-container)]/50 px-2 py-0.5 rounded border border-[var(--tertiary)]/30">
                #{user?.uniqueId}
              </span>
            </div>
          </div>

          {society && (
            <div className="border-b border-[var(--outline)]/30 px-3 py-2 text-xs text-[var(--on-surface)]/70 flex items-center gap-2">
              <Building className="h-3.5 w-3.5 text-[var(--primary)]" />
              <span className="truncate">{society.name} ({society.societyCode})</span>
            </div>
          )}

          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[var(--on-surface)]/80 transition-colors hover:bg-[var(--surface-variant)]/60 hover:text-[var(--on-surface)]"
            >
              <UserIcon className="h-4 w-4 text-[var(--primary)]" />
              Profile Details
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[var(--on-surface)]/80 transition-colors hover:bg-[var(--surface-variant)]/60 hover:text-[var(--on-surface)]"
            >
              <ShieldCheck className="h-4 w-4 text-[var(--secondary)]" />
              Account Settings
            </Link>
          </div>

          <div className="border-t border-[var(--outline)]/30 pt-1">
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[var(--error)] transition-colors hover:bg-[var(--error-container)]/50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

