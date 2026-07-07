import { Search } from "lucide-react";

interface IssueSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function IssueSearch({ value, onChange }: IssueSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input
        type="search"
        placeholder="Search issues..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
        aria-label="Search issues"
      />
    </div>
  );
}
