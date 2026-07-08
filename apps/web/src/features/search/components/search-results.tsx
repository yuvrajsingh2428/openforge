import { Repository } from "@openforge/github-client";
import { RepositoryCard } from "@/features/repositories/components/repository-card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  repositories: Repository[];
  loading?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
}

export function SearchResults({ repositories, loading, hasNextPage, onLoadMore }: SearchResultsProps) {
  return (
    <div className="space-y-6 relative">
      <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        {repositories.map(repo => (
          <RepositoryCard key={repo.id} repository={{ ...repo, category: "Search Result" } as any} />
        ))}
      </div>
      
      {loading && repositories.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {hasNextPage && (
        <div className="text-center pt-4">
          <Button 
            variant="outline" 
            onClick={onLoadMore} 
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
