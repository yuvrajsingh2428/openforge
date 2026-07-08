import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Recommendation } from "@openforge/recommendation-engine";
import { ScoreBadge } from "./score-badge";
import { FactorBreakdown } from "./factor-breakdown";
import { ReasonList } from "./reason-list";
import { RecommendationExtraStats } from "./recommendation-extra-stats";
interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { repoOwner, repoName, issueNumber } = recommendation;
  
  return (
    <article className="group relative flex flex-col rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-md hover:border-foreground/20">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>{recommendation.repoFullName}</span>
            {recommendation.repoLanguage && (
              <>
                <span>•</span>
                <span>{recommendation.repoLanguage}</span>
              </>
            )}
          </div>
          <h3 className="font-semibold text-base line-clamp-2">
            <span className="text-muted-foreground font-normal">#{issueNumber} </span>
            {recommendation.issueTitle}
          </h3>
        </div>
        <div className="shrink-0 flex flex-col items-end">
          <ScoreBadge score={recommendation.overallScore} className="scale-110 origin-top-right" />
          <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1 tracking-widest">Match</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-foreground mb-2">
          {recommendation.explanation.summary}
        </p>
        <ReasonList factors={recommendation.explanation.factors} />
        <RecommendationExtraStats 
          owner={repoOwner} 
          repo={repoName} 
          issueNumber={issueNumber} 
        />
      </div>

      <div className="mt-auto pt-4 border-t border-border/50">
        <div className="mb-4">
          <FactorBreakdown factors={recommendation.explanation.factors} />
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            href={`/issues/${repoOwner}/${repoName}/${issueNumber}`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View Details
          </Link>
          <a
            href={recommendation.issueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Open issue on GitHub`}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
