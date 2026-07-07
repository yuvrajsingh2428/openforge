import type { Issue } from "@openforge/github-client";
import { IssueCard } from "./issue-card";

interface IssueGridProps {
  issues: Issue[];
}

export function IssueGrid({ issues }: IssueGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
}
