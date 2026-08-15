import { RepositoryGridSkeleton } from "@/features/repositories/components/repository-skeleton";

export default function Loading() {
  return (
    <div className="container py-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-4 w-96 bg-muted/60 rounded animate-pulse" />
      </div>
      <RepositoryGridSkeleton count={9} />
    </div>
  );
}
