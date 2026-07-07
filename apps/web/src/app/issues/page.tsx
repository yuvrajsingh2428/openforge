import type { Metadata } from "next";
import { getIssuesFromCuratedRepos } from "@openforge/github-client";
import { CURATED_REPOSITORIES } from "@openforge/config";
import { IssueExplorer } from "@/features/issues/components/issue-explorer";
import { IssueErrorState } from "@/features/issues/components/issue-error-state";
import { IssueGridSkeleton } from "@/features/issues/components/issue-skeleton";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Issue Explorer | OpenForge",
  description:
    "Browse open issues from curated repositories. Filter by repository, language, label, and sort by activity.",
};

async function IssuesContent() {
  try {
    const issues = await getIssuesFromCuratedRepos(CURATED_REPOSITORIES, 5);
    return <IssueExplorer issues={issues} />;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : undefined;
    return <IssueErrorState message={message} />;
  }
}

export default function IssuesPage() {
  return (
    <Suspense fallback={<IssueGridSkeleton count={9} />}>
      <IssuesContent />
    </Suspense>
  );
}
