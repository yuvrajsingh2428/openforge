import { ScoreBadge } from "./score-badge";

interface FactorBreakdownProps {
  factors: ReadonlyArray<{
    name: string;
    score: number;
    weight: number;
    weightedScore: number;
  }>;
}

export function FactorBreakdown({ factors }: FactorBreakdownProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {factors.map((factor) => (
        <div key={factor.name} className="flex flex-col gap-1 rounded-lg border bg-muted/50 p-2">
          <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">{factor.name}</span>
          <div className="flex items-end justify-between">
            <ScoreBadge score={factor.score} />
            <span className="text-[10px] text-muted-foreground">{factor.weight * 100}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
