import { RepositoryGridSkeleton } from "@/features/repositories/components/repository-skeleton";

export function SearchSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <RepositoryGridSkeleton count={6} />
    </div>
  );
}
