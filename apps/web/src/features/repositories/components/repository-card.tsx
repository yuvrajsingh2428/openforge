import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { RepositoryWithCategory } from "../types";
import { RepositoryLanguageBadge } from "./repository-language-badge";
import { RepositoryTopicBadge } from "./repository-topic-badge";
import { RepositoryStats } from "./repository-stats";

interface RepositoryCardProps {
  repository: RepositoryWithCategory;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

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

export function RepositoryCard({ repository }: RepositoryCardProps) {
  const [owner, name] = repository.nameWithOwner.split("/");
  const topics = repository.repositoryTopics?.nodes.map((t) => t.topic.name) ?? [];

  return (
    <article className="group relative flex flex-col rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-md hover:border-foreground/20">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {repository.owner?.avatarUrl && (
            <img
              src={repository.owner.avatarUrl}
              alt={`${owner} avatar`}
              className="h-8 w-8 rounded-full border border-border shrink-0"
              loading="lazy"
            />
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate">
              <span className="text-muted-foreground font-normal">{owner}/</span>
              {name}
            </h3>
            <span className="text-xs text-muted-foreground">{repository.category}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
        {repository.description ?? "No description available."}
      </p>

      {/* Topics */}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {topics.slice(0, 4).map((topic) => (
            <RepositoryTopicBadge key={topic} name={topic} />
          ))}
          {topics.length > 4 && (
            <span className="text-xs text-muted-foreground self-center">
              +{topics.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/50 mt-auto">
        <div className="flex items-center gap-3">
          {repository.primaryLanguage && (
            <RepositoryLanguageBadge
              name={repository.primaryLanguage.name}
              color={repository.primaryLanguage.color}
            />
          )}
          <RepositoryStats
            stars={repository.stargazerCount}
            forks={repository.forkCount}
            openIssues={repository.openIssues?.totalCount}
          />
        </div>
        {repository.updatedAt && (
          <span className="text-xs text-muted-foreground shrink-0">
            {timeAgo(repository.updatedAt)}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-3">
        <Link
          href={`/repositories/${owner}/${name}`}
          className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          View Details
        </Link>
        <a
          href={repository.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center justify-center rounded-lg border border-input bg-background px-3 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Open ${repository.nameWithOwner} on GitHub`}
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
