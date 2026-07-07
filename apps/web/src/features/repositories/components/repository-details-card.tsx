import { ExternalLink } from "lucide-react";
import type { Repository } from "@openforge/github-client";
import { RepositoryLanguageBadge } from "./repository-language-badge";
import { RepositoryTopicBadge } from "./repository-topic-badge";
import { RepositoryStats } from "./repository-stats";
import { RepositoryMetadata } from "./repository-metadata";

interface RepositoryDetailsCardProps {
  repository: Repository;
}

export function RepositoryDetailsCard({ repository }: RepositoryDetailsCardProps) {
  const [owner, name] = repository.nameWithOwner.split("/");
  const topics = repository.repositoryTopics?.nodes.map((t) => t.topic.name) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {repository.owner?.avatarUrl && (
          <img
            src={repository.owner.avatarUrl}
            alt={`${owner} avatar`}
            className="h-16 w-16 rounded-xl border border-border shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-muted-foreground font-normal">{owner}/</span>
            {name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {repository.description ?? "No description available."}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-xl border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3">Statistics</h2>
        <RepositoryStats
          stars={repository.stargazerCount}
          forks={repository.forkCount}
          openIssues={repository.openIssues?.totalCount}
        />
        {repository.primaryLanguage && (
          <div className="mt-3">
            <RepositoryLanguageBadge
              name={repository.primaryLanguage.name}
              color={repository.primaryLanguage.color}
            />
          </div>
        )}
      </div>

      {/* Topics */}
      {topics.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-sm font-semibold mb-3">Topics</h2>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <RepositoryTopicBadge key={topic} name={topic} />
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="rounded-xl border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3">Details</h2>
        <RepositoryMetadata repository={repository} />
      </div>

      {/* Health Placeholder */}
      <div className="rounded-xl border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3">Repository Health</h2>
        <p className="text-sm text-muted-foreground">
          Repository health analysis will be available in a future update.
        </p>
      </div>
    </div>
  );
}
