import { Search } from "lucide-react";

interface SearchEmptyStateProps {
  query: string;
}

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl bg-card text-card-foreground">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No repositories found</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        We couldn&apos;t find any repositories matching &quot;{query}&quot;. Try adjusting your search query.
      </p>
    </div>
  );
}
