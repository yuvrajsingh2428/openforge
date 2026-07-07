import { ExternalLink } from "lucide-react";
import type { Issue } from "@openforge/github-client";
import { IssueStateBadge } from "./issue-state-badge";
import { IssueLabels } from "./issue-labels";
import { IssueRepositoryBadge } from "./issue-repository-badge";
import { IssueMetadata } from "./issue-metadata";
import { IssueComments } from "./issue-comments";
import { IssueMarkdownViewer } from "./issue-markdown-viewer";
import { IssueTimeline } from "./issue-timeline";
import { IssueDifficultyBadge, IssueImpactBadge, IssueMaintainerBadge } from "./issue-placeholder-badges";

interface IssueDetailsCardProps {
  issue: Issue;
  repositoryName?: string;
}

export function IssueDetailsCard({ issue, repositoryName }: IssueDetailsCardProps) {
  const labels = issue.labels?.nodes ?? [];
  const repoDisplay = repositoryName ?? issue.repository?.nameWithOwner;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <IssueStateBadge state={issue.state} />
          {issue.repository && (
            <IssueRepositoryBadge
              nameWithOwner={issue.repository.nameWithOwner}
              language={issue.repository.primaryLanguage?.name}
              languageColor={issue.repository.primaryLanguage?.color}
            />
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          <span className="text-muted-foreground font-normal">#{issue.number} </span>
          {issue.title}
        </h1>
        {repoDisplay && (
          <p className="text-sm text-muted-foreground">in {repoDisplay}</p>
        )}
        <div className="flex items-center gap-3 mt-3">
          <a
            href={issue.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            View on GitHub
          </a>
        </div>
      </div>

      {/* Labels */}
      {labels.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-sm font-semibold mb-3">Labels</h2>
          <IssueLabels labels={labels} limit={20} />
        </div>
      )}

      {/* Metadata */}
      <div className="rounded-xl border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3">Details</h2>
        <IssueMetadata issue={issue} />
      </div>

      {/* Body */}
      {issue.body && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-sm font-semibold mb-3">Description</h2>
          <IssueMarkdownViewer content={issue.body} />
        </div>
      )}

      {/* Timeline */}
      <IssueTimeline issue={issue} />

      {/* Comments */}
      <IssueComments count={issue.comments?.totalCount ?? 0} />

      {/* Recommendation Placeholders */}
      <div className="rounded-xl border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3">Contribution Insights</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Detailed analysis will be available in a future update.
        </p>
        <div className="flex flex-wrap gap-2">
          <IssueDifficultyBadge />
          <IssueImpactBadge />
          <IssueMaintainerBadge />
        </div>
      </div>
    </div>
  );
}
