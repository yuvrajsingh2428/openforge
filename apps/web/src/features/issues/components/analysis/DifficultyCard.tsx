import { explainDifficulty, type DifficultyBadgeLevel } from "@openforge/ai-analysis";
import { Gauge } from "lucide-react";

interface DifficultyCardProps {
  difficulty: DifficultyBadgeLevel;
}

export function DifficultyCard({ difficulty }: DifficultyCardProps) {
  const explanation = explainDifficulty(difficulty);

  let bgClass = "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30";
  if (difficulty === "Medium") {
    bgClass = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
  } else if (difficulty === "Hard") {
    bgClass = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
          <Gauge className="h-4 w-4" aria-hidden="true" />
          Implementation Difficulty
        </h3>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${bgClass}`}>
          {difficulty}
        </span>
      </div>
      <p className="text-sm font-medium">{explanation.label}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{explanation.description}</p>
    </div>
  );
}
