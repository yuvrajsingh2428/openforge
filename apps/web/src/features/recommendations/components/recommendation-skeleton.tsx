export function RecommendationSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-5 w-48 rounded bg-muted" />
        </div>
        <div className="h-8 w-12 rounded-full bg-muted" />
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="h-4 w-4/6 rounded bg-muted" />
      </div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-muted" />
        ))}
      </div>
      <div className="h-9 w-full rounded bg-muted" />
    </div>
  );
}

export function RecommendationGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <RecommendationSkeleton key={i} />
      ))}
    </div>
  );
}
