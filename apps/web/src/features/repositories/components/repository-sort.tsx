import type { SortKey, SortDirection } from "../types";

interface RepositorySortProps {
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSortChange: (key: SortKey, direction: SortDirection) => void;
}

const SORT_OPTIONS: { label: string; key: SortKey; direction: SortDirection }[] = [
  { label: "Most Stars", key: "stars", direction: "desc" },
  { label: "Fewest Stars", key: "stars", direction: "asc" },
  { label: "Most Forks", key: "forks", direction: "desc" },
  { label: "Recently Updated", key: "updated", direction: "desc" },
  { label: "A → Z", key: "name", direction: "asc" },
  { label: "Z → A", key: "name", direction: "desc" },
];

export function RepositorySort({ sortKey, sortDirection, onSortChange }: RepositorySortProps) {
  const currentValue = `${sortKey}-${sortDirection}`;

  return (
    <select
      value={currentValue}
      onChange={(e) => {
        const option = SORT_OPTIONS.find((o) => `${o.key}-${o.direction}` === e.target.value);
        if (option) {
          onSortChange(option.key, option.direction);
        }
      }}
      className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer"
      aria-label="Sort repositories"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={`${option.key}-${option.direction}`} value={`${option.key}-${option.direction}`}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
