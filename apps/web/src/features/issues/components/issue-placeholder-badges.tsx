import { Gauge } from "lucide-react";

export function IssueDifficultyBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
      <Gauge className="h-3 w-3" aria-hidden="true" />
      Difficulty TBD
    </span>
  );
}

export function IssueImpactBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
      Learning Impact TBD
    </span>
  );
}

export function IssueMaintainerBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
      Maintainer TBD
    </span>
  );
}
