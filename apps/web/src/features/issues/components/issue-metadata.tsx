import { Calendar, User, Users } from "lucide-react";
import type { Issue } from "@openforge/github-client";

interface IssueMetadataProps {
  issue: Issue;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function IssueMetadata({ issue }: IssueMetadataProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {issue.author && (
        <div className="flex items-center gap-2.5 text-sm">
          <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-muted-foreground">Author:</span>
          <span className="inline-flex items-center gap-1.5">
            <img src={issue.author.avatarUrl} alt="" className="h-4 w-4 rounded-full" loading="lazy" />
            <span className="text-foreground">{issue.author.login}</span>
          </span>
        </div>
      )}
      <div className="flex items-center gap-2.5 text-sm">
        <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-muted-foreground">Created:</span>
        <span className="text-foreground">{formatDate(issue.createdAt)}</span>
      </div>
      {issue.updatedAt && (
        <div className="flex items-center gap-2.5 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-muted-foreground">Updated:</span>
          <span className="text-foreground">{formatDate(issue.updatedAt)}</span>
        </div>
      )}
      {issue.assignees && issue.assignees.nodes.length > 0 && (
        <div className="flex items-center gap-2.5 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-muted-foreground">Assignees:</span>
          <div className="flex -space-x-1">
            {issue.assignees.nodes.map((a) => (
              <img
                key={a.login}
                src={a.avatarUrl}
                alt={a.login}
                title={a.login}
                className="h-5 w-5 rounded-full border-2 border-background"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}
      {issue.milestone && (
        <div className="flex items-center gap-2.5 text-sm">
          <span className="text-muted-foreground">Milestone:</span>
          <span className="text-foreground">{issue.milestone.title}</span>
        </div>
      )}
    </div>
  );
}
