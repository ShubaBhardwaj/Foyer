"use client";

import { Breadcrumbs } from "./Breadcrumbs";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--outline)]/30 bg-[var(--surface)]/85 px-4 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden text-[var(--on-surface)]/70 hover:text-[var(--on-surface)]"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Placeholder */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-[var(--on-surface)]/70 hover:text-[var(--on-surface)] hover:bg-[var(--surface-variant)]/50"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--tertiary)] animate-pulse" />
        </Button>

        <ThemeToggle />

        <div className="h-5 w-[1px] bg-[var(--outline)]/30" />

        <UserMenu />
      </div>
    </header>
  );
}

