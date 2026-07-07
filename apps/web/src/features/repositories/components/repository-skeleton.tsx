export function RepositorySkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-8 w-8 rounded-full bg-muted" />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 w-3/5 rounded bg-muted" />
          <div className="h-3 w-2/5 rounded bg-muted" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-4/5 rounded bg-muted" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-16 rounded-md bg-muted" />
        <div className="h-5 w-14 rounded-md bg-muted" />
        <div className="h-5 w-12 rounded-md bg-muted" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-3 w-12 rounded bg-muted" />
        <div className="h-3 w-12 rounded bg-muted" />
        <div className="h-3 w-12 rounded bg-muted" />
      </div>
    </div>
  );
}

export function RepositoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <RepositorySkeleton key={i} />
      ))}
    </div>
  );
}
