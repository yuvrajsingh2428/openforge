import { Sparkles, HelpCircle, Target } from "lucide-react";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { EstimatedHoursBadge } from "./EstimatedHoursBadge";

interface IssueSummaryCardProps {
  summary: string;
  beginnerExplanation: string;
  whyItMatters: string;
  confidence: number;
  estimatedHours: number;
}

export function IssueSummaryCard({
  summary,
  beginnerExplanation,
  whyItMatters,
  confidence,
  estimatedHours,
}: IssueSummaryCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-bold">AI Educational Summary</h2>
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceBadge confidence={confidence} />
          <EstimatedHoursBadge estimatedHours={estimatedHours} />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">
            Executive Summary
          </h3>
          <p className="text-sm leading-relaxed text-foreground font-medium">{summary}</p>
        </div>

        <div className="p-4 rounded-lg bg-muted/40 border space-y-1.5">
          <h3 className="text-xs font-semibold text-primary flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Beginner Friendly Breakdown
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{beginnerExplanation}</p>
        </div>

        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-1.5">
          <h3 className="text-xs font-semibold text-primary flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5" aria-hidden="true" />
            Why This Issue Matters
          </h3>
          <p className="text-xs leading-relaxed text-foreground/90">{whyItMatters}</p>
        </div>
      </div>
    </div>
  );
}
