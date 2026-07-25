import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-[var(--primary)]/30 bg-[var(--primary-container)] text-[var(--on-primary-container)]",
        secondary:
          "border-[var(--secondary)]/30 bg-[var(--secondary-container)] text-[var(--on-secondary-container)]",
        destructive:
          "border-[var(--error)]/30 bg-[var(--error-container)] text-[var(--error)]",
        outline: "text-[var(--on-surface)] border-[var(--outline)]",
        success: "border-[var(--success)]/30 bg-[var(--success-container)] text-[var(--success)]",
        warning: "border-[var(--warning)]/30 bg-[var(--warning-container)] text-[var(--warning)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

