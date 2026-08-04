import { GraduationCap } from "lucide-react";

interface ConceptsCardProps {
  concepts: string[];
}

export function ConceptsCard({ concepts }: ConceptsCardProps) {
  if (!concepts || concepts.length === 0) return null;

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
        <GraduationCap className="h-4 w-4" aria-hidden="true" />
        Concepts to Learn
      </h3>
      <ul className="grid gap-2 sm:grid-cols-2">
        {concepts.map((concept, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs text-foreground bg-muted/30 p-2 rounded-lg border">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            <span>{concept}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
