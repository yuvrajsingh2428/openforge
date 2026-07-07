interface RecommendationFiltersProps {
  repositories: string[];
  languages: string[];
  categories: string[];
  selectedRepository: string;
  selectedLanguage: string;
  selectedCategory: string;
  selectedMinScore: number;
  onRepositoryChange: (repo: string) => void;
  onLanguageChange: (language: string) => void;
  onCategoryChange: (category: string) => void;
  onMinScoreChange: (score: number) => void;
}

export function RecommendationFilters({
  repositories,
  languages,
  categories,
  selectedRepository,
  selectedLanguage,
  selectedCategory,
  selectedMinScore,
  onRepositoryChange,
  onLanguageChange,
  onCategoryChange,
  onMinScoreChange,
}: RecommendationFiltersProps) {
  const selectClass = "h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer";

  return (
    <div className="flex flex-wrap gap-3">
      <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} className={selectClass} aria-label="Filter by category">
        <option value="">All Categories</option>
        {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
      </select>
      <select value={selectedLanguage} onChange={(e) => onLanguageChange(e.target.value)} className={selectClass} aria-label="Filter by language">
        <option value="">All Languages</option>
        {languages.map((l) => (<option key={l} value={l}>{l}</option>))}
      </select>
      <select value={selectedRepository} onChange={(e) => onRepositoryChange(e.target.value)} className={selectClass} aria-label="Filter by repository">
        <option value="">All Repositories</option>
        {repositories.map((r) => (<option key={r} value={r}>{r}</option>))}
      </select>
      <select value={selectedMinScore} onChange={(e) => onMinScoreChange(Number(e.target.value))} className={selectClass} aria-label="Filter by minimum score">
        <option value={0}>Any Score</option>
        <option value={40}>Score &ge; 40</option>
        <option value={60}>Score &ge; 60</option>
        <option value={80}>Score &ge; 80</option>
      </select>
    </div>
  );
}
