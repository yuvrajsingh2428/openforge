import { Clock } from "lucide-react";
import { estimateTimeRequirements } from "@openforge/ai-analysis";

interface EstimatedHoursBadgeProps {
  estimatedHours: number;
}

export function EstimatedHoursBadge({ estimatedHours }: EstimatedHoursBadgeProps) {
  const { displayText, breakdownNotice } = estimateTimeRequirements(estimatedHours);

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-muted/50 text-foreground text-xs font-medium"
      title={breakdownNotice}
    >
      <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      <span>{displayText} est.</span>
    </span>
  );
}
