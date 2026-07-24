import { Role } from "@/types";
import { ROLE_BADGE_VARIANTS } from "@/constants/roles";
import { cn } from "@/lib/cn";

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = ROLE_BADGE_VARIANTS[role] || {
    label: role,
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
