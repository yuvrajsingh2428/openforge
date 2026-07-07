import { CircleDot, CheckCircle2, Clock } from "lucide-react";
import type { Issue } from "@openforge/github-client";

interface IssueTimelineProps {
  issue: Issue;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function IssueTimeline({ issue }: IssueTimelineProps) {
  const events: { icon: React.ReactNode; label: string; date: string }[] = [
    {
      icon: <CircleDot className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />,
      label: "Opened",
      date: formatDate(issue.createdAt),
    },
  ];

  if (issue.updatedAt && issue.updatedAt !== issue.createdAt) {
    events.push({
      icon: <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />,
      label: "Last updated",
      date: formatDate(issue.updatedAt),
    });
  }

  if (issue.closedAt) {
    events.push({
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" aria-hidden="true" />,
      label: "Closed",
      date: formatDate(issue.closedAt),
    });
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <h2 className="text-sm font-semibold mb-3">Timeline</h2>
      <div className="space-y-3">
        {events.map((event, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm">
            {event.icon}
            <span className="text-muted-foreground">{event.label}:</span>
            <span className="text-foreground">{event.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
