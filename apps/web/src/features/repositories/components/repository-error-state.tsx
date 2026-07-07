import { AlertTriangle, RefreshCw } from "lucide-react";

interface RepositoryErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function RepositoryErrorState({ message, onRetry }: RepositoryErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold mb-1">Something went wrong</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        {message ?? "We couldn't load the repositories. This might be a temporary issue with the GitHub API."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}
