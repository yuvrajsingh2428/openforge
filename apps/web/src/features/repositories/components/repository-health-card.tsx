import { Activity, GitMerge, FileText, Users } from "lucide-react";
import { HealthScore } from "@openforge/repository-intelligence";
import { RepositoryHealthBadge } from "./repository-health-badge";

interface RepositoryHealthCardProps {
  health: HealthScore;
}

export function RepositoryHealthCard({ health }: RepositoryHealthCardProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b bg-muted/50">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Repository Health
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {health.explanation.summary}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{health.totalScore}<span className="text-lg text-muted-foreground">/100</span></div>
          <RepositoryHealthBadge score={health.totalScore} />
        </div>
      </div>
      <div className="p-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <GitMerge className="h-4 w-4" /> Activity & Maintenance
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Activity</div>
              <div className="font-semibold text-lg">{health.breakdown.activityScore}/100</div>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Maintenance</div>
              <div className="font-semibold text-lg">{health.breakdown.maintenanceScore}/100</div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Users className="h-4 w-4" /> Community & Docs
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Community</div>
              <div className="font-semibold text-lg">{health.breakdown.communityScore}/100</div>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Documentation</div>
              <div className="font-semibold text-lg">{health.breakdown.documentationScore}/100</div>
            </div>
          </div>
        </div>
      </div>
      {(health.explanation.strengths.length > 0 || health.explanation.weaknesses.length > 0 || health.explanation.suggestions?.length > 0) && (
        <div className="p-6 border-t bg-muted/20 space-y-4">
          {health.explanation.strengths.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Strengths</h5>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {health.explanation.strengths.map((str, i) => <li key={i}>{str}</li>)}
              </ul>
            </div>
          )}
          {health.explanation.weaknesses.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Areas for Improvement</h5>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {health.explanation.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}
          {health.explanation.suggestions && health.explanation.suggestions.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Suggestions</h5>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {health.explanation.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
