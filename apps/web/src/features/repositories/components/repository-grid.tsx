import type { RepositoryWithCategory } from "../types";
import { RepositoryCard } from "./repository-card";

interface RepositoryGridProps {
  repositories: RepositoryWithCategory[];
}

export function RepositoryGrid({ repositories }: RepositoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repositories.map((repo) => (
        <RepositoryCard key={repo.id} repository={repo} />
      ))}
    </div>
  );
}
