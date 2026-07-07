import Link from "next/link";
import { MessageSquare, ThumbsUp, ExternalLink } from "lucide-react";
import type { Issue } from "@openforge/github-client";
import { IssueStateBadge } from "./issue-state-badge";
import { IssueLabels } from "./issue-labels";
import { IssueRepositoryBadge } from "./issue-repository-badge";

interface IssueCardProps {
  issue: Issue;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function IssueCard({ issue }: IssueCardProps) {
  const owner = issue.repository?.owner.login ?? "";
  const repoName = issue.repository?.name ?? "";
  const labels = issue.labels?.nodes ?? [];

  return (
    <article className="group relative flex flex-col rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-md hover:border-foreground/20">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <IssueStateBadge state={issue.state} />
          {issue.repository && (
            <IssueRepositoryBadge
              nameWithOwner={issue.repository.nameWithOwner}
              language={issue.repository.primaryLanguage?.name}
              languageColor={issue.repository.primaryLanguage?.color}
            />
          )}
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{timeAgo(issue.createdAt)}</span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
        <span className="text-muted-foreground font-normal">#{issue.number} </span>
        {issue.title}
      </h3>

      {/* Labels */}
      {labels.length > 0 && (
        <div className="mb-3">
          <IssueLabels labels={labels} />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/50 mt-auto">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {issue.author && (
            <span className="inline-flex items-center gap-1">
              <img
                src={issue.author.avatarUrl}
                alt={issue.author.login}
                className="h-4 w-4 rounded-full"
                loading="lazy"
              />
              {issue.author.login}
            </span>
          )}
          {issue.comments && issue.comments.totalCount > 0 && (
            <span className="inline-flex items-center gap-1" aria-label={`${issue.comments.totalCount} comments`}>
              <MessageSquare className="h-3 w-3" aria-hidden="true" />
              {issue.comments.totalCount}
            </span>
          )}
          {issue.reactions && issue.reactions.totalCount > 0 && (
            <span className="inline-flex items-center gap-1" aria-label={`${issue.reactions.totalCount} reactions`}>
              <ThumbsUp className="h-3 w-3" aria-hidden="true" />
              {issue.reactions.totalCount}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3">
        <Link
          href={`/issues/${owner}/${repoName}/${issue.number}`}
          className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          View Details
        </Link>
        <a
          href={issue.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center justify-center rounded-lg border border-input bg-background px-3 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Open issue #${issue.number} on GitHub`}
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
