import { MessageSquare } from "lucide-react";

interface IssueCommentsProps {
  count: number;
}

export function IssueComments({ count }: IssueCommentsProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <MessageSquare className="h-4 w-4" aria-hidden="true" />
        Comments
      </h2>
      <p className="text-sm text-muted-foreground">
        {count === 0
          ? "No comments yet. Be the first to contribute!"
          : `${count} ${count === 1 ? "comment" : "comments"} on this issue. View the full discussion on GitHub.`}
      </p>
    </div>
  );
}
