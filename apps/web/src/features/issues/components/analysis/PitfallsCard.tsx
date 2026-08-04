import { AlertTriangle } from "lucide-react";

interface PitfallsCardProps {
  pitfalls: string[];
}

export function PitfallsCard({ pitfalls }: PitfallsCardProps) {
  if (!pitfalls || pitfalls.length === 0) return null;

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3 border-amber-500/30 bg-amber-500/5">
      <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        Common Pitfalls & Mistakes to Avoid
      </h3>
      <ul className="space-y-2">
        {pitfalls.map((pitfall, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs text-foreground bg-background/80 p-2 rounded-md border">
            <span className="text-amber-500 font-bold">•</span>
            <span>{pitfall}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
