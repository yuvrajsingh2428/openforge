import { Target, Info } from "lucide-react";
import { ContributionEstimate } from "@openforge/issue-engine";
import { ContributionSizeBadge } from "./contribution-size-badge";

interface ContributionEstimateCardProps {
  estimate: ContributionEstimate;
}

export function ContributionEstimateCard({ estimate }: ContributionEstimateCardProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b bg-muted/50">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Contribution Estimate
        </h3>
        <ContributionSizeBadge size={estimate.size} />
      </div>
      <div className="p-4 space-y-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Confidence</span>
          <span>{Math.round(estimate.confidence * 100)}%</span>
        </div>
        {estimate.estimatedEffortDays !== undefined && (
          <div className="flex justify-between text-muted-foreground">
            <span>Estimated Effort</span>
            <span>~{estimate.estimatedEffortDays} day{estimate.estimatedEffortDays === 1 ? '' : 's'}</span>
          </div>
        )}
        
        {estimate.reasons.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              <Info className="h-3 w-3" />
              Reasons
            </span>
            <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
              {estimate.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
