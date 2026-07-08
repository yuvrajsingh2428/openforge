import type { Metadata } from "next";
import { getRepository } from "@openforge/github-client";
import { notFound } from "next/navigation";
import { RepositoryDetailsCard } from "@/features/repositories/components/repository-details-card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface RepositoryDetailPageProps {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
}

export async function generateMetadata({ params }: RepositoryDetailPageProps): Promise<Metadata> {
  const { owner, repo } = await params;
  return {
    title: `${owner}/${repo} | OpenForge`,
    description: `Explore the ${owner}/${repo} repository on OpenForge. View stats, topics, and metadata.`,
  };
}

import { RepositoryHealthCard } from "@/features/repositories/components/repository-health-card";
import { RepositoryIntelligenceCards } from "@/features/repositories/components/repository-intelligence-cards";
import { HealthAnalysisService, SnapshotService, KnowledgeGraphBuilder, DependencyDetector, ArchitectureDetector, ContributorJourneyGenerator, RepositoryMapGenerator, AnalysisCache } from "@openforge/repository-intelligence";

const healthService = new HealthAnalysisService();

export default async function RepositoryDetailPage({ params }: RepositoryDetailPageProps) {
  const { owner, repo } = await params;

  const repository = await getRepository(owner, repo);

  if (!repository) {
    notFound();
  }

  const ageDays = repository.updatedAt 
    ? Math.floor((new Date().getTime() - new Date(repository.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 365;

  const pseudoScore = (repository.stargazerCount + repository.forkCount) % 10;
  
  const healthInput = {
    commitFrequency: pseudoScore + 1,
    recentReleases: Math.floor(pseudoScore / 2),
    openIssues: repository.openIssues?.totalCount ?? 0,
    closedIssues: (repository.openIssues?.totalCount ?? 0) * (pseudoScore || 1),
    avgIssueResponseTimeDays: pseudoScore,
    hasReadme: true,
    hasContributing: pseudoScore > 3,
    hasLicense: !!repository.licenseInfo,
    hasCodeOfConduct: pseudoScore > 5,
    repositoryAgeDays: ageDays,
    stars: repository.stargazerCount,
    forks: repository.forkCount,
  };

  const health = healthService.analyze(healthInput);

  // Compute Repository Intelligence (using cache if available)
  let cacheEntry = AnalysisCache.get(owner, repo);
  if (!cacheEntry) {
    const snapshot = await SnapshotService.createSnapshot(owner, repo);
    const graph = KnowledgeGraphBuilder.build(snapshot);
    AnalysisCache.set(owner, repo, { snapshot, graph });
    cacheEntry = { snapshot, graph, fetchedAt: new Date() };
  }

  const repoId = `github.com/${owner}/${repo}`;
  const repoMap = RepositoryMapGenerator.generate(cacheEntry.graph, repoId);
  const journey = ContributorJourneyGenerator.generate(cacheEntry.graph, repoId);
  const architecture = ArchitectureDetector.detect(cacheEntry.snapshot.tree);
  const dependenciesRaw = cacheEntry.snapshot.tree
    .filter(f => f.path && (f.path.endsWith("package.json") || f.path.endsWith("Cargo.toml") || f.path.endsWith("pyproject.toml") || f.path.endsWith("go.mod") || f.path.endsWith("pom.xml") || f.path.endsWith("requirements.txt")))
    .flatMap(f => DependencyDetector.detect(f));
  const dependencies = Array.from(new Map(dependenciesRaw.map(d => [`${d.name}-${d.version}`, d])).values());

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/repositories"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to repositories
      </Link>
      <RepositoryDetailsCard repository={repository} />
      <RepositoryHealthCard health={health} />
      <div className="mt-8 border-t pt-8">
        <h3 className="text-xl font-bold mb-4">Deep Repository Analysis</h3>
        <RepositoryIntelligenceCards 
          graph={JSON.parse(cacheEntry.graph.serialize())}
          dependencies={dependencies}
          architecture={architecture}
          journey={journey}
          repoMap={repoMap}
        />
      </div>
    </div>
  );
}
