import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
}

export function LoadingSpinner({ className, label }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader2 className={cn("h-8 w-8 animate-spin text-purple-500", className)} />
      {label && <p className="text-sm font-medium text-slate-400">{label}</p>}
    </div>
  );
}
