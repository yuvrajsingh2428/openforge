interface IssueFiltersProps {
  repositories: string[];
  languages: string[];
  labels: string[];
  selectedRepository: string;
  selectedLanguage: string;
  selectedLabel: string;
  selectedState: string;
  onRepositoryChange: (repo: string) => void;
  onLanguageChange: (language: string) => void;
  onLabelChange: (label: string) => void;
  onStateChange: (state: string) => void;
}

export function IssueFilters({
  repositories,
  languages,
  labels,
  selectedRepository,
  selectedLanguage,
  selectedLabel,
  selectedState,
  onRepositoryChange,
  onLanguageChange,
  onLabelChange,
  onStateChange,
}: IssueFiltersProps) {
  const selectClass = "h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer";

  return (
    <div className="flex flex-wrap gap-3">
      <select value={selectedRepository} onChange={(e) => onRepositoryChange(e.target.value)} className={selectClass} aria-label="Filter by repository">
        <option value="">All Repositories</option>
        {repositories.map((r) => (<option key={r} value={r}>{r}</option>))}
      </select>
      <select value={selectedLanguage} onChange={(e) => onLanguageChange(e.target.value)} className={selectClass} aria-label="Filter by language">
        <option value="">All Languages</option>
        {languages.map((l) => (<option key={l} value={l}>{l}</option>))}
      </select>
      <select value={selectedLabel} onChange={(e) => onLabelChange(e.target.value)} className={selectClass} aria-label="Filter by label">
        <option value="">All Labels</option>
        {labels.slice(0, 50).map((l) => (<option key={l} value={l}>{l}</option>))}
      </select>
      <select value={selectedState} onChange={(e) => onStateChange(e.target.value)} className={selectClass} aria-label="Filter by state">
        <option value="">All States</option>
        <option value="OPEN">Open</option>
        <option value="CLOSED">Closed</option>
      </select>
    </div>
  );
}
