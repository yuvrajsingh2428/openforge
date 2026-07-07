import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  label?: string;
  className?: string;
}

export function ScoreBadge({ score, label, className }: ScoreBadgeProps) {
  let colorClass = "bg-red-500/15 text-red-500";
  if (score >= 80) colorClass = "bg-emerald-500/15 text-emerald-500";
  else if (score >= 60) colorClass = "bg-yellow-500/15 text-yellow-500";

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn("inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold", colorClass)}>
        {score}
      </span>
      {label && <span className="text-xs text-muted-foreground font-medium">{label}</span>}
    </div>
  );
}
