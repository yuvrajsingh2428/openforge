import { CheckSquare } from "lucide-react";

interface TestingStrategyCardProps {
  testingStrategy: string[];
}

export function TestingStrategyCard({ testingStrategy }: TestingStrategyCardProps) {
  if (!testingStrategy || testingStrategy.length === 0) return null;

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
        <CheckSquare className="h-4 w-4" aria-hidden="true" />
        Testing Strategy & Edge Cases
      </h3>
      <ul className="space-y-2">
        {testingStrategy.map((test, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs text-foreground p-2 rounded-md bg-muted/30 border">
            <span className="text-primary font-bold mr-1">✓</span>
            <span>{test}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
