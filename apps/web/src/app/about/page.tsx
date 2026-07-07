export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About OpenForge</h1>
        <p className="text-muted-foreground mt-2">
          Our mission and architectural principles.
        </p>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-12 text-center flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Core Principles</h2>
        <ul className="text-muted-foreground text-sm list-disc list-inside">
          <li>Engineering quality over speed</li>
          <li>Clean architecture over shortcuts</li>
          <li>Readability over cleverness</li>
          <li>Modular code over monolithic code</li>
        </ul>
      </div>
    </div>
  )
}
