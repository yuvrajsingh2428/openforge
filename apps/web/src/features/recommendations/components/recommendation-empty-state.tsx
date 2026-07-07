import { SearchX } from "lucide-react";

interface RecommendationEmptyStateProps {
  hasFilters: boolean;
  onReset?: () => void;
}

export function RecommendationEmptyState({ hasFilters, onReset }: RecommendationEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No recommendations found</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        {hasFilters
          ? "No recommendations match your current filters. Try adjusting your search or filter criteria."
          : "We couldn't generate any recommendations at the moment. Check back later."}
      </p>
      {hasFilters && onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}
