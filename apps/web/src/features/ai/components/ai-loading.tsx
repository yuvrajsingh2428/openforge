import { Loader2 } from "lucide-react";

export function AILoading({ message = "Analyzing with AI..." }: { message?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4" role="status" aria-live="polite">
      <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
      <span className="text-sm font-medium text-primary">{message}</span>
    </div>
  );
}
