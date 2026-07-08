import { Activity } from "lucide-react";

interface RepositoryHealthBadgeProps {
  score: number;
}

export function RepositoryHealthBadge({ score }: RepositoryHealthBadgeProps) {
  let color = "text-yellow-500 bg-yellow-500/10";
  let label = "Average";

  if (score >= 80) {
    color = "text-green-500 bg-green-500/10";
    label = "Healthy";
  } else if (score < 50) {
    color = "text-red-500 bg-red-500/10";
    label = "At Risk";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${color}`} title={`Health Score: ${score}/100`}>
      <Activity className="h-3.5 w-3.5" />
      {label} ({score})
    </span>
  );
}
