interface RepositoryFiltersProps {
  languages: string[];
  categories: string[];
  selectedLanguage: string;
  selectedCategory: string;
  onLanguageChange: (language: string) => void;
  onCategoryChange: (category: string) => void;
}

export function RepositoryFilters({
  languages,
  categories,
  selectedLanguage,
  selectedCategory,
  onLanguageChange,
  onCategoryChange,
}: RepositoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer"
        aria-label="Filter by language"
      >
        <option value="">All Languages</option>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer"
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
