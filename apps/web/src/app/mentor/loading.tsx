export default function MentorLoading() {
  return (
    <div className="container py-8 max-w-5xl mx-auto space-y-8 animate-pulse">
      <div className="space-y-3">
        <div className="h-9 w-64 bg-muted rounded-md" />
        <div className="h-5 w-96 bg-muted rounded-md" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="h-40 bg-muted rounded-xl p-6 space-y-4">
          <div className="h-6 w-32 bg-muted-foreground/20 rounded" />
          <div className="h-4 w-full bg-muted-foreground/20 rounded" />
          <div className="h-4 w-3/4 bg-muted-foreground/20 rounded" />
        </div>
        <div className="h-40 bg-muted rounded-xl p-6 space-y-4">
          <div className="h-6 w-32 bg-muted-foreground/20 rounded" />
          <div className="h-4 w-full bg-muted-foreground/20 rounded" />
          <div className="h-4 w-3/4 bg-muted-foreground/20 rounded" />
        </div>
        <div className="h-40 bg-muted rounded-xl p-6 space-y-4">
          <div className="h-6 w-32 bg-muted-foreground/20 rounded" />
          <div className="h-4 w-full bg-muted-foreground/20 rounded" />
          <div className="h-4 w-3/4 bg-muted-foreground/20 rounded" />
        </div>
      </div>

      <div className="h-96 bg-muted rounded-xl p-6 space-y-6">
        <div className="h-7 w-48 bg-muted-foreground/20 rounded" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-muted-foreground/20 rounded" />
          <div className="h-4 w-5/6 bg-muted-foreground/20 rounded" />
          <div className="h-4 w-4/6 bg-muted-foreground/20 rounded" />
        </div>
      </div>
    </div>
  );
}
