export function IssueSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-5 w-14 rounded-full bg-muted" />
        <div className="h-5 w-24 rounded-md bg-muted" />
      </div>
      <div className="space-y-1.5 mb-3">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
      </div>
      <div className="flex gap-1.5 mb-3">
        <div className="h-5 w-16 rounded-full bg-muted" />
        <div className="h-5 w-20 rounded-full bg-muted" />
      </div>
      <div className="flex items-center gap-3 pt-3 border-t border-border/50">
        <div className="h-4 w-4 rounded-full bg-muted" />
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-3 w-8 rounded bg-muted" />
      </div>
    </div>
  );
}

export function IssueGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <IssueSkeleton key={i} />
      ))}
    </div>
  );
}
