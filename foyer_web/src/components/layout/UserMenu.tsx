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
        className="flex items-center gap-3 rounded-full p-1 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-8 w-8 rounded-full border border-purple-500/30 object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 font-semibold text-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="hidden text-left md:block">
          <p className="text-xs font-semibold text-slate-200">{displayName}</p>
          <p className="text-[10px] text-slate-400">Unique ID: {user?.uniqueId || "N/A"}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-100 shadow-2xl backdrop-blur-md z-50 animate-in fade-in-0 zoom-in-95">
          <div className="border-b border-slate-800/80 px-3 py-2.5">
            <p className="text-sm font-semibold text-slate-100">{displayName}</p>
            <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
            <div className="mt-2 flex items-center justify-between">
              {primaryRole && <RoleBadge role={primaryRole} />}
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                #{user?.uniqueId}
              </span>
            </div>
          </div>

          {society && (
            <div className="border-b border-slate-800/80 px-3 py-2 text-xs text-slate-400 flex items-center gap-2">
              <Building className="h-3.5 w-3.5 text-purple-400" />
              <span className="truncate">{society.name} ({society.societyCode})</span>
            </div>
          )}

          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <UserIcon className="h-4 w-4 text-purple-400" />
              Profile Details
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              Account Settings
            </Link>
          </div>

          <div className="border-t border-slate-800/80 pt-1">
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-500/10"
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
