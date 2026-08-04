import { ListOrdered } from "lucide-react";

interface ImplementationStrategyCardProps {
  strategy: string[];
}

export function ImplementationStrategyCard({ strategy }: ImplementationStrategyCardProps) {
  if (!strategy || strategy.length === 0) return null;

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
        <ListOrdered className="h-4 w-4" aria-hidden="true" />
        Implementation Strategy
      </h3>
      <ol className="space-y-3">
        {strategy.map((step, idx) => (
          <li key={idx} className="flex gap-3 text-xs leading-relaxed bg-muted/20 p-3 rounded-lg border">
            <span className="h-5 w-5 shrink-0 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[11px]">
              {idx + 1}
            </span>
            <span className="text-foreground pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
