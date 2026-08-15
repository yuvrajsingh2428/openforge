import { describe, it, expect, vi } from "vitest";

vi.mock("@openforge/repository-intelligence", () => ({
  SnapshotService: {
    createSnapshot: vi.fn().mockResolvedValue({ tree: [{ path: "src/index.ts" }, { path: "package.json" }] }),
  },
  KnowledgeGraphBuilder: {
    build: vi.fn().mockReturnValue({}),
  },
  ArchitectureDetector: {
    detect: vi.fn().mockReturnValue(["Monorepo", "TypeScript"]),
  },
  DependencyDetector: {
    detect: vi.fn().mockReturnValue([{ name: "react", version: "18.0.0" }]),
  },
  RepositoryMapGenerator: {
    generate: vi.fn().mockReturnValue({ entryPoints: ["src/index.ts"], directories: ["src", "tests"] }),
  },
  AnalysisCache: {
    get: vi.fn().mockReturnValue(null),
    set: vi.fn(),
  },
}));

vi.mock("@openforge/recommendation-engine", () => ({
  scoreIssue: vi.fn().mockReturnValue({
    overallScore: 85,
    breakdown: {
      learning: { score: 90 },
      aiRelevance: { score: 80 },
      maintainer: { score: 85 },
      impact: { score: 75 },
      mergeProbability: { score: 95 },
    },
  }),
}));

import { buildIssueAnalysisContext } from "../src/issue-analysis/context-builder";

describe("buildIssueAnalysisContext", () => {
  const mockIssue: any = {
    id: "issue-123",
    number: 42,
    title: "Fix crash on invalid input",
    body: "Steps to reproduce...",
    state: "OPEN",
    url: "https://github.com/owner/repo/issues/42",
    createdAt: new Date().toISOString(),
    author: { login: "octocat", avatarUrl: "" },
    labels: { nodes: [{ name: "bug", color: "ff0000" }] },
    comments: { totalCount: 3 },
    repository: {
      name: "repo",
      nameWithOwner: "owner/repo",
      owner: { login: "owner", avatarUrl: "" },
      primaryLanguage: { name: "TypeScript", color: "#007acc" },
    },
  };

  it("builds complete issue analysis context", async () => {
    const context = await buildIssueAnalysisContext("owner", "repo", mockIssue);

    expect(context.title).toBe("Fix crash on invalid input");
    expect(context.repoFullName).toBe("owner/repo");
    expect(context.repoLanguage).toBe("TypeScript");
    expect(context.labels).toEqual(["bug"]);
    expect(context.commentCount).toBe(3);
    expect(context.overallScore).toBe(85);
    expect(context.learningScore).toBe(90);
    expect(context.architecture).toEqual(["Monorepo", "TypeScript"]);
    expect(context.dependencies).toEqual(["react"]);
  });
});
