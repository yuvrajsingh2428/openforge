import type { Metadata } from "next";
import { Suspense } from "react";
import { getIssuesFromCuratedRepos } from "@openforge/github-client";
import { CURATED_REPOSITORIES } from "@openforge/config";
import { generateRecommendations } from "@openforge/recommendation-engine";
import { RecommendationExplorer } from "@/features/recommendations/components/recommendation-explorer";
import { RecommendationErrorState } from "@/features/recommendations/components/recommendation-error-state";
import { RecommendationGridSkeleton } from "@/features/recommendations/components/recommendation-skeleton";

export const metadata: Metadata = {
  title: "Recommendations | OpenForge",
  description: "Discover impactful issues tailored to your skills, scored deterministically by our recommendation engine.",
};

async function RecommendationsContent() {
  try {
    const issues = await getIssuesFromCuratedRepos(CURATED_REPOSITORIES, 10);
    
    // Map repo nameWithOwner to category
    const categoryMap = new Map<string, string>();
    for (const repo of CURATED_REPOSITORIES) {
      categoryMap.set(`${repo.owner}/${repo.name}`, repo.category);
    }

    const recommendations = generateRecommendations(issues, categoryMap);
    
    return <RecommendationExplorer recommendations={recommendations} />;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    return <RecommendationErrorState message={message} />;
  }
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<RecommendationGridSkeleton count={9} />}>
      <RecommendationsContent />
    </Suspense>
  );
}
