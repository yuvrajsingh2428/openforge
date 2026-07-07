import { CheckCircle2 } from "lucide-react";

interface ReasonListProps {
  factors: ReadonlyArray<{
    name: string;
    topReason: string;
  }>;
}

export function ReasonList({ factors }: ReasonListProps) {
  return (
    <ul className="space-y-1.5">
      {factors.slice(0, 3).map((factor, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden="true" />
          <span>
            <strong className="font-medium text-foreground">{factor.name}:</strong>{" "}
            {factor.topReason}
          </span>
        </li>
      ))}
    </ul>
  );
}
