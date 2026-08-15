import type { Issue } from "@openforge/github-client";
import { scoreIssue } from "@openforge/recommendation-engine";
import {
  SnapshotService,
  KnowledgeGraphBuilder,
  ArchitectureDetector,
  DependencyDetector,
  RepositoryMapGenerator,
  AnalysisCache,
} from "@openforge/repository-intelligence";

export interface IssueAnalysisContext {
  title: string;
  body: string;
  labels: string[];
  commentCount: number;
  author: string;
  state: string;
  repoFullName: string;
  repoLanguage: string | null;
  architecture: string[];
  dependencies: string[];
  entryPoints: string[];
  modules: string[];
  testDirectories: string[];
  overallScore: number;
  learningScore: number;
  aiRelevanceScore: number;
  maintainerScore: number;
}

export async function buildIssueAnalysisContext(
  owner: string,
  repo: string,
  issue: Issue,
): Promise<IssueAnalysisContext> {
  const repoFullName = `${owner}/${repo}`;
  const repoId = `github.com/${repoFullName}`;

  // 1. Fetch or load Repository Intelligence & Knowledge Graph
  let architecture: string[] = [];
  let dependencies: string[] = [];
  let entryPoints: string[] = [];
  let modules: string[] = [];

  try {
    let cacheEntry = AnalysisCache.get(owner, repo);
    if (!cacheEntry) {
      const snapshot = await SnapshotService.createSnapshot(owner, repo);
      const graph = KnowledgeGraphBuilder.build(snapshot);
      AnalysisCache.set(owner, repo, { snapshot, graph });
      cacheEntry = { snapshot, graph, fetchedAt: new Date() };
    }

    architecture = ArchitectureDetector.detect(cacheEntry.snapshot.tree).map((p: any) =>
      typeof p === "string" ? p : p?.name ?? String(p)
    );

    const dependenciesRaw = cacheEntry.snapshot.tree
      .filter(
        (f) =>
          f.path &&
          (f.path.endsWith("package.json") ||
            f.path.endsWith("Cargo.toml") ||
            f.path.endsWith("pyproject.toml") ||
            f.path.endsWith("go.mod") ||
            f.path.endsWith("pom.xml") ||
            f.path.endsWith("requirements.txt")),
      )
      .flatMap((f) => DependencyDetector.detect(f));
    dependencies = Array.from(new Set(dependenciesRaw.map((d) => d.name)));

    const repoMap = RepositoryMapGenerator.generate(cacheEntry.graph, repoId);
    entryPoints = repoMap.entryPoints;
    modules = repoMap.directories;
  } catch {
    // Graceful fallback if repo intelligence cannot snapshot (e.g. offline/mock)
  }

  // 2. Compute Deterministic Recommendation Engine Scores (Read-Only)
  const recommendation = scoreIssue(issue, "General");

  // 3. Extract Issue fields safely
  const title = issue.title;
  const body = issue.body || "";
  const labels = issue.labels?.nodes.map((l) => l.name) ?? [];
  const commentCount = issue.comments?.totalCount ?? 0;
  const author = issue.author?.login ?? "unknown";
  const state = issue.state;
  const repoLanguage = issue.repository?.primaryLanguage?.name ?? null;

  return {
    title,
    body,
    labels,
    commentCount,
    author,
    state,
    repoFullName,
    repoLanguage,
    architecture,
    dependencies,
    entryPoints,
    modules,
    testDirectories: modules.filter((m) => m.toLowerCase().includes("test") || m.toLowerCase().includes("__tests__")),
    overallScore: recommendation.overallScore,
    learningScore: recommendation.breakdown.learning.score,
    aiRelevanceScore: recommendation.breakdown.aiRelevance.score,
    maintainerScore: recommendation.breakdown.maintainer.score,
  };
}
