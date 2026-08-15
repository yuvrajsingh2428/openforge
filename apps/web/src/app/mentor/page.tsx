import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CURATED_REPOSITORIES } from "@openforge/config";
import { getRepositoriesByNames } from "@openforge/github-client";
import MentorLoading from "./loading";

export const metadata: Metadata = {
  title: "Engineering Mentor | OpenForge",
  description:
    "Interactive AI onboarding and guided open-source mentorship for engineers.",
};

async function MentorDashboardContent() {
  const repositories = await getRepositoriesByNames(CURATED_REPOSITORIES.slice(0, 6));

  return (
    <div className="space-y-10">
      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            01
          </div>
          <h3 className="text-xl font-semibold tracking-tight">Structured Onboarding</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Get personalized roadmap guidance tailored to repository architecture, dependencies, and code conventions.
          </p>
        </div>

        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            02
          </div>
          <h3 className="text-xl font-semibold tracking-tight">Guided Code Analysis</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Break down complex GitHub issues step-by-step without AI writing patches for you.
          </p>
        </div>

        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            03
          </div>
          <h3 className="text-xl font-semibold tracking-tight">PR Readiness Check</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Review test strategy, file location predictions, and maintainer friendliness before submitting pull requests.
          </p>
        </div>
      </div>

      {/* Recommended Repositories for Mentorship */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Select a Repository to Start Mentorship</h2>
            <p className="text-sm text-muted-foreground">
              Choose a project to receive guided codebase insights and curated issue recommendations.
            </p>
          </div>
          <Link
            href="/repositories"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            View All 24 Repositories &rarr;
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/50 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {repo.primaryLanguage?.name || "Code"}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    ★ {repo.stargazerCount.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-tight">{repo.nameWithOwner}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {repo.description || "No description available."}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  {repo.openIssues?.totalCount ?? 0} open issues
                </span>
                <Link
                  href={`/repositories/${repo.owner?.login}/${repo.name}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Start Mentorship &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Guidance CTA */}
      <div className="p-8 rounded-2xl border bg-gradient-to-r from-primary/10 via-card to-background space-y-4 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight">Need Help Choosing a Path?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our recommendation engine calculates 5-factor fit scores based on your skill goals, learning value, and maintainer friendliness.
          </p>
        </div>
        <Link
          href="/recommendations"
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors whitespace-nowrap shadow"
        >
          Explore Recommendations &rarr;
        </Link>
      </div>
    </div>
  );
}

export default function MentorPage() {
  return (
    <div className="container py-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Engineering Mentor</h1>
        <p className="text-muted-foreground">
          Accelerate your open-source journey with guided architectural insights and educational analysis.
        </p>
      </div>

      <Suspense fallback={<MentorLoading />}>
        <MentorDashboardContent />
      </Suspense>
    </div>
  );
}
