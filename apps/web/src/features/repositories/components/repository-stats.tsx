import { Star, GitFork, CircleDot } from "lucide-react";

interface RepositoryStatsProps {
  stars: number;
  forks: number;
  openIssues?: number;
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

export function RepositoryStats({ stars, forks, openIssues }: RepositoryStatsProps) {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1" aria-label={`${stars} stars`}>
        <Star className="h-3.5 w-3.5" aria-hidden="true" />
        {formatCount(stars)}
      </span>
      <span className="inline-flex items-center gap-1" aria-label={`${forks} forks`}>
        <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
        {formatCount(forks)}
      </span>
      {openIssues !== undefined && (
        <span className="inline-flex items-center gap-1" aria-label={`${openIssues} open issues`}>
          <CircleDot className="h-3.5 w-3.5" aria-hidden="true" />
          {formatCount(openIssues)}
        </span>
      )}
    </div>
  );
}
