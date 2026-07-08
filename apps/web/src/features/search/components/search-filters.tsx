import { Search as SearchIcon, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SearchFiltersParams {
  language?: string;
  architecture?: string;
  technology?: string;
  testingFramework?: string;
  buildTool?: string;
  packageManager?: string;
  database?: string;
  ci?: string;
}

interface SearchFiltersProps {
  query: string;
  setQuery: (q: string) => void;
  filters: SearchFiltersParams;
  onFilterChange: (key: keyof SearchFiltersParams, value: string) => void;
  onClearFilters: () => void;
}

export function SearchFilters({ query, setQuery, filters, onFilterChange, onClearFilters }: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 bg-card border rounded-lg p-2 shadow-sm">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search repositories on GitHub..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-10 pl-9 border-none shadow-none focus-visible:outline-none bg-transparent"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
              onClick={() => setQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-card shadow-inner">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Language</label>
            <select
              value={filters.language || ""}
              onChange={(e) => onFilterChange("language", e.target.value)}
              className="w-full mt-1 h-9 rounded-md border bg-transparent px-2 text-xs focus:ring-1"
            >
              <option value="">Any</option>
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="go">Go</option>
              <option value="python">Python</option>
              <option value="rust">Rust</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Architecture</label>
            <select
              value={filters.architecture || ""}
              onChange={(e) => onFilterChange("architecture", e.target.value)}
              className="w-full mt-1 h-9 rounded-md border bg-transparent px-2 text-xs focus:ring-1"
            >
              <option value="">Any</option>
              <option value="Monorepo">Monorepo</option>
              <option value="Microservices">Microservices</option>
              <option value="MVC">MVC</option>
              <option value="Clean Architecture">Clean Architecture</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Technology</label>
            <select
              value={filters.technology || ""}
              onChange={(e) => onFilterChange("technology", e.target.value)}
              className="w-full mt-1 h-9 rounded-md border bg-transparent px-2 text-xs focus:ring-1"
            >
              <option value="">Any</option>
              <option value="react">React</option>
              <option value="vue">Vue</option>
              <option value="nextjs">Next.js</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Testing Framework</label>
            <select
              value={filters.testingFramework || ""}
              onChange={(e) => onFilterChange("testingFramework", e.target.value)}
              className="w-full mt-1 h-9 rounded-md border bg-transparent px-2 text-xs focus:ring-1"
            >
              <option value="">Any</option>
              <option value="vitest">Vitest</option>
              <option value="jest">Jest</option>
              <option value="playwright">Playwright</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Build Tool</label>
            <select
              value={filters.buildTool || ""}
              onChange={(e) => onFilterChange("buildTool", e.target.value)}
              className="w-full mt-1 h-9 rounded-md border bg-transparent px-2 text-xs focus:ring-1"
            >
              <option value="">Any</option>
              <option value="vite">Vite</option>
              <option value="webpack">Webpack</option>
              <option value="turbo">Turborepo</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Package Manager</label>
            <select
              value={filters.packageManager || ""}
              onChange={(e) => onFilterChange("packageManager", e.target.value)}
              className="w-full mt-1 h-9 rounded-md border bg-transparent px-2 text-xs focus:ring-1"
            >
              <option value="">Any</option>
              <option value="npm">npm</option>
              <option value="pnpm">pnpm</option>
              <option value="cargo">cargo</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Database</label>
            <select
              value={filters.database || ""}
              onChange={(e) => onFilterChange("database", e.target.value)}
              className="w-full mt-1 h-9 rounded-md border bg-transparent px-2 text-xs focus:ring-1"
            >
              <option value="">Any</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="redis">Redis</option>
              <option value="mongodb">MongoDB</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">CI System</label>
            <select
              value={filters.ci || ""}
              onChange={(e) => onFilterChange("ci", e.target.value)}
              className="w-full mt-1 h-9 rounded-md border bg-transparent px-2 text-xs focus:ring-1"
            >
              <option value="">Any</option>
              <option value="github-actions">GitHub Actions</option>
              <option value="gitlab">GitLab CI</option>
            </select>
          </div>

          <div className="col-span-2 md:col-span-4 flex justify-end">
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs">
              Clear All Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
