import type { Metadata } from "next";
import { getRepositoriesByNames } from "@openforge/github-client";
import { CURATED_REPOSITORIES } from "@openforge/config";
import { RepositoryExplorer } from "@/features/repositories/components/repository-explorer";
import { RepositoryErrorState } from "@/features/repositories/components/repository-error-state";
import { RepositoryGridSkeleton } from "@/features/repositories/components/repository-skeleton";
import type { RepositoryWithCategory } from "@/features/repositories/types";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Repository Explorer | OpenForge",
  description:
    "Browse curated open-source repositories. Filter by language, category, and sort by stars, forks, or activity.",
};

async function RepositoriesContent() {
  try {
    const repositories = await getRepositoriesByNames(CURATED_REPOSITORIES);

    const enriched: RepositoryWithCategory[] = repositories.map((repo) => {
      const config = CURATED_REPOSITORIES.find(
        (c) => c.owner === repo.owner?.login && c.name === repo.name
      );
      return { ...repo, category: config?.category ?? "Uncategorized" };
    });

    return <RepositoryExplorer repositories={enriched} />;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    return <RepositoryErrorState message={message} />;
  }
}

export default function RepositoriesPage() {
  return (
    <Suspense fallback={<RepositoryGridSkeleton count={9} />}>
      <RepositoriesContent />
    </Suspense>
  );
}
