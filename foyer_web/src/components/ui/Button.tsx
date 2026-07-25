import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--on-primary)] shadow-md hover:opacity-90 shadow-[var(--primary)]/20 font-semibold",
        secondary:
          "bg-[var(--secondary-container)] text-[var(--on-secondary-container)] border border-[var(--outline)]/40 hover:bg-[var(--secondary-container)]/80 shadow-sm",
        outline:
          "border border-[var(--outline)] bg-transparent text-[var(--on-surface)] hover:bg-[var(--primary-container)]/20 hover:text-[var(--on-surface)]",
        ghost: "text-[var(--on-surface)]/80 hover:bg-[var(--surface-variant)]/60 hover:text-[var(--on-surface)]",
        danger:
          "bg-[var(--error)] text-[var(--on-error)] shadow-sm hover:opacity-90 shadow-red-900/20",
        link: "text-[var(--tertiary)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

