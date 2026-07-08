export default function DebugRecommendationPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Debug: Recommendation Engine</h1>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-col space-y-1.5">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Status</h3>
        </div>
        <div className="p-6 pt-0">
          <p className="text-green-500 font-medium">Operational</p>
          <div className="mt-4 p-4 bg-muted rounded-md font-mono text-sm">
            {JSON.stringify({ status: "ok", memory: "128MB", ops: "150/s" }, null, 2)}
          </div>
        </div>
      </div>
    </div>
  );
}