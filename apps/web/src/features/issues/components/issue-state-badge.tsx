import { CircleDot, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface IssueStateBadgeProps {
  state: string;
}

export function IssueStateBadge({ state }: IssueStateBadgeProps) {
  const isOpen = state === "OPEN";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isOpen
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-purple-500/15 text-purple-400"
      )}
    >
      {isOpen ? (
        <CircleDot className="h-3 w-3" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
      )}
      {isOpen ? "Open" : "Closed"}
    </span>
  );
}
