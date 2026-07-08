import { AlertTriangle } from "lucide-react";

interface AIErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function AIError({ message = "AI analysis failed. Please try again.", onRetry }: AIErrorProps) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4" role="alert">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm font-medium text-destructive">{message}</p>
          {onRetry && (
            <button onClick={onRetry} className="mt-2 text-sm font-medium text-destructive underline underline-offset-2 hover:no-underline">
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
