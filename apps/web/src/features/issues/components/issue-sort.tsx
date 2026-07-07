import type { IssueSortKey, IssueSortDirection } from "../types";

interface IssueSortProps {
  sortKey: IssueSortKey;
  sortDirection: IssueSortDirection;
  onSortChange: (key: IssueSortKey, direction: IssueSortDirection) => void;
}

const SORT_OPTIONS: { label: string; key: IssueSortKey; direction: IssueSortDirection }[] = [
  { label: "Newest", key: "newest", direction: "desc" },
  { label: "Oldest", key: "oldest", direction: "asc" },
  { label: "Most Comments", key: "comments", direction: "desc" },
  { label: "Recently Updated", key: "updated", direction: "desc" },
  { label: "A → Z", key: "name", direction: "asc" },
];

export function IssueSort({ sortKey, sortDirection, onSortChange }: IssueSortProps) {
  const currentValue = `${sortKey}-${sortDirection}`;

  return (
    <select
      value={currentValue}
      onChange={(e) => {
        const option = SORT_OPTIONS.find((o) => `${o.key}-${o.direction}` === e.target.value);
        if (option) onSortChange(option.key, option.direction);
      }}
      className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer"
      aria-label="Sort issues"
    >
      {SORT_OPTIONS.map((o) => (
        <option key={`${o.key}-${o.direction}`} value={`${o.key}-${o.direction}`}>{o.label}</option>
      ))}
    </select>
  );
}
