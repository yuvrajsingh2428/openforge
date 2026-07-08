import { Target } from "lucide-react";
import { ContributionSize } from "@openforge/issue-engine";

interface ContributionSizeBadgeProps {
  size: ContributionSize;
}

export function ContributionSizeBadge({ size }: ContributionSizeBadgeProps) {
  let color = "text-blue-500 bg-blue-500/10";
  let label = size;

  switch (size) {
    case "XS":
    case "S":
      color = "text-green-500 bg-green-500/10";
      break;
    case "M":
      color = "text-blue-500 bg-blue-500/10";
      break;
    case "L":
      color = "text-orange-500 bg-orange-500/10";
      break;
    case "XL":
      color = "text-red-500 bg-red-500/10";
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${color}`} title={`Estimated Size: ${label}`}>
      <Target className="h-3 w-3" />
      Size {label}
    </span>
  );
}
