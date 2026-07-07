import type { RecommendationSortKey, RecommendationSortDirection } from "../types";

interface RecommendationSortProps {
  sortKey: RecommendationSortKey;
  sortDirection: RecommendationSortDirection;
  onSortChange: (key: RecommendationSortKey, direction: RecommendationSortDirection) => void;
}

const SORT_OPTIONS: { label: string; key: RecommendationSortKey; direction: RecommendationSortDirection }[] = [
  { label: "Highest Score", key: "score", direction: "desc" },
  { label: "Lowest Score", key: "score", direction: "asc" },
  { label: "Highest Learning", key: "learning", direction: "desc" },
  { label: "Highest Impact", key: "impact", direction: "desc" },
  { label: "Highest Merge Prob.", key: "mergeProbability", direction: "desc" },
  { label: "Newest", key: "newest", direction: "desc" },
  { label: "Oldest", key: "oldest", direction: "asc" },
];

export function RecommendationSort({ sortKey, sortDirection, onSortChange }: RecommendationSortProps) {
  const currentValue = `${sortKey}-${sortDirection}`;

  return (
    <select
      value={currentValue}
      onChange={(e) => {
        const option = SORT_OPTIONS.find((o) => `${o.key}-${o.direction}` === e.target.value);
        if (option) onSortChange(option.key, option.direction);
      }}
      className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer"
      aria-label="Sort recommendations"
    >
      {SORT_OPTIONS.map((o) => (
        <option key={`${o.key}-${o.direction}`} value={`${o.key}-${o.direction}`}>{o.label}</option>
      ))}
    </select>
  );
}
