import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Failed to load data",
  message = "An error occurred while communicating with the backend API.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
      <div className="rounded-full bg-red-500/10 p-3 text-red-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h4 className="mt-3 text-base font-semibold text-slate-100">{title}</h4>
      <p className="mt-1 text-sm text-slate-400 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-4 gap-2 border-red-500/30 hover:bg-red-500/10">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Request
        </Button>
      )}
    </div>
  );
}
