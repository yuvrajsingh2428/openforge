import { describe, it, expect, vi } from "vitest";

// Route imports
import { GET as healthGET } from "../src/app/api/health/route";
import { GET as versionGET } from "../src/app/api/version/route";
import { GET as configGET } from "../src/app/api/config/route";
import { GET as repositoriesGET } from "../src/app/api/repositories/route";
import { GET as repoIntelligenceGET } from "../src/app/api/repositories/[owner]/[repo]/intelligence/route";
import { GET as issuesGET } from "../src/app/api/issues/route";
import { GET as issueRecommendationGET } from "../src/app/api/issues/[id]/recommendation/route";
import { GET as recommendationsGET } from "../src/app/api/recommendations/route";
import { GET as recommendationsBreakdownGET } from "../src/app/api/recommendations/[issueId]/breakdown/route";
import { GET as searchRepositoriesGET } from "../src/app/api/search/repositories/route";
import { GET as searchIssuesGET } from "../src/app/api/search/issues/route";
import { GET as searchTechGET } from "../src/app/api/search/technologies/route";
import { GET as searchArchGET } from "../src/app/api/search/architectures/route";
import { GET as debugCacheGET, POST as debugCachePOST } from "../src/app/api/debug/cache/route";
import { GET as debugRepositoriesGET } from "../src/app/api/debug/repositories/route";

import { POST as aiSummaryPOST } from "../src/app/api/ai/summary/route";
import { POST as aiComplexityPOST } from "../src/app/api/ai/complexity/route";
import { POST as aiConceptsPOST } from "../src/app/api/ai/concepts/route";
import { POST as aiPlanPOST } from "../src/app/api/ai/contribution-plan/route";
import { POST as aiLearningPOST } from "../src/app/api/ai/learning-path/route";
import { POST as aiRepoSummaryPOST } from "../src/app/api/ai/repository-summary/route";

import { GET as mentorSessionGET } from "../src/app/api/repositories/[owner]/[repo]/issues/[number]/mentor/session/route";
import { GET as mentorReadingGET } from "../src/app/api/repositories/[owner]/[repo]/issues/[number]/mentor/reading-order/route";
import { GET as mentorStrategyGET } from "../src/app/api/repositories/[owner]/[repo]/issues/[number]/mentor/strategy/route";
import { GET as mentorDebuggingGET } from "../src/app/api/repositories/[owner]/[repo]/issues/[number]/mentor/debugging/route";
import { GET as mentorChecklistGET } from "../src/app/api/repositories/[owner]/[repo]/issues/[number]/mentor/checklist/route";

// Mocks
vi.mock("@openforge/github-client", () => ({
  getIssues: vi.fn().mockResolvedValue({ nodes: [], totalCount: 0 }),
  searchRepositories: vi.fn().mockResolvedValue([]),
  getRepositoriesByNames: vi.fn().mockResolvedValue([]),
  getIssuesFromCuratedRepos: vi.fn().mockResolvedValue([]),
  getRepositories: vi.fn().mockResolvedValue([]),
  getRepository: vi.fn().mockResolvedValue({
    stargazerCount: 10,
    forkCount: 2,
    openIssues: { totalCount: 1 },
    licenseInfo: { name: "MIT" },
    updatedAt: new Date().toISOString()
  }),
  getIssue: vi.fn().mockResolvedValue({
    issue: {
      title: "Fix bug",
      body: "Description",
      createdAt: new Date().toISOString(),
      labels: { nodes: [] },
      comments: { totalCount: 0 },
      assignees: { nodes: [] }
    }
  })
}));

vi.mock("@openforge/recommendation-engine", () => ({
  scoreIssue: vi.fn().mockReturnValue({
    overallScore: 54,
    breakdown: { impact: 20, mergeProbability: 34 },
    explanation: { factors: [] }
  }),
  generateRecommendations: vi.fn().mockReturnValue([])
}));

vi.mock("@openforge/ai-analysis", () => ({
  generateIssueSummary: vi.fn().mockResolvedValue({ success: true, data: { summary: "Ok" }, cached: false, model: "test", durationMs: 1 }),
  generateComplexityAnalysis: vi.fn().mockResolvedValue({ success: true, data: { complexity: "low" }, cached: false, model: "test", durationMs: 1 }),
  generateConceptExtraction: vi.fn().mockResolvedValue({ success: true, data: { concepts: [] }, cached: false, model: "test", durationMs: 1 }),
  generateContributionPlan: vi.fn().mockResolvedValue({ success: true, data: { stages: [] }, cached: false, model: "test", durationMs: 1 }),
  generateLearningPath: vi.fn().mockResolvedValue({ success: true, data: { path: [] }, cached: false, model: "test", durationMs: 1 }),
  generateRepositorySummary: vi.fn().mockResolvedValue({ success: true, data: { overview: "Ok" }, cached: false, model: "test", durationMs: 1 })
}));

vi.mock("@openforge/engineering-mentor", () => ({
  MentorService: {
    generateMentorSession: vi.fn().mockResolvedValue({
      repoOwner: "owner",
      repoName: "repo",
      issueNumber: 1,
      generatedAt: new Date().toISOString(),
      repositoryOverview: "Overview",
      issueUnderstanding: "Understanding",
      concepts: [],
      prerequisites: [],
      readingOrder: [],
      strategySteps: [],
      debugGuide: {
        rootCauses: [],
        relevantFiles: [],
        affectedTests: [],
        logsToWatch: [],
        verificationSteps: []
      },
      reviewChecklist: [],
      learningOutcomes: [],
      commonMistakes: [],
      warnings: []
    })
  }
}));

vi.mock("@openforge/repository-intelligence", () => ({
  SnapshotService: {
    createSnapshot: vi.fn().mockResolvedValue({
      owner: "test",
      repo: "repo",
      fetchedAt: new Date(),
      tree: []
    })
  },
  KnowledgeGraphBuilder: {
    build: vi.fn().mockReturnValue({
      serialize: vi.fn().mockReturnValue('{"nodes":[],"edges":[]}')
    })
  },
  DependencyDetector: {
    detect: vi.fn().mockReturnValue([])
  },
  ArchitectureDetector: {
    detect: vi.fn().mockReturnValue([])
  },
  ContributorJourneyGenerator: {
    generate: vi.fn().mockReturnValue([])
  },
  RepositoryMapGenerator: {
    generate: vi.fn().mockReturnValue({ directories: [], files: [], entryPoints: [] })
  },
  AnalysisCache: {
    get: vi.fn().mockReturnValue(null),
    set: vi.fn()
  },
  HealthAnalysisService: vi.fn().mockImplementation(() => ({
    analyze: vi.fn().mockReturnValue({
      score: 85,
      factors: []
    })
  }))
}));

describe("Comprehensive API Standardized Envelopes & Routing Tests", () => {
  // Helpers
  const checkEnvelope = async (res: any, status: number = 200, isSuccess: boolean = true) => {
    expect(res.status).toBe(status);
    const body = await res.json();
    expect(body).toHaveProperty("success", isSuccess);
    expect(body).toHaveProperty("data");
    expect(body).toHaveProperty("error");
    expect(body).toHaveProperty("meta");
    expect(typeof body.meta).toBe("object");
  };

  it("GET /api/health", async () => {
    const res = await healthGET();
    await checkEnvelope(res);
  });

  it("GET /api/version", async () => {
    const res = await versionGET();
    await checkEnvelope(res);
  });

  it("GET /api/config", async () => {
    const res = await configGET();
    await checkEnvelope(res);
  });

  it("GET /api/repositories", async () => {
    const res = await repositoriesGET();
    await checkEnvelope(res);
  });

  it("GET /api/repositories/[owner]/[repo]/intelligence", async () => {
    const params = Promise.resolve({ owner: "test", repo: "repo" });
    const res = await repoIntelligenceGET(new Request("http://localhost"), { params });
    await checkEnvelope(res);
  });

  it("GET /api/issues", async () => {
    const res = await issuesGET();
    await checkEnvelope(res);
  });

  it("GET /api/issues/[id]/recommendation", async () => {
    const params = Promise.resolve({ id: "test-repo-1" });
    const res = await issueRecommendationGET(new Request("http://localhost"), { params });
    await checkEnvelope(res);
  });

  it("GET /api/recommendations", async () => {
    const res = await recommendationsGET();
    await checkEnvelope(res);
  });

  it("GET /api/recommendations/[issueId]/breakdown", async () => {
    const params = Promise.resolve({ issueId: "test-repo-1" });
    const res = await recommendationsBreakdownGET(new Request("http://localhost"), { params });
    await checkEnvelope(res);
  });

  it("GET /api/search/repositories", async () => {
    const req = new Request("http://localhost/api/search/repositories?q=react&language=typescript");
    const res = await searchRepositoriesGET(req);
    await checkEnvelope(res);
  });

  it("GET /api/search/issues", async () => {
    const req = new Request("http://localhost/api/search/issues?q=bug");
    const res = await searchIssuesGET(req);
    await checkEnvelope(res);
  });

  it("GET /api/search/technologies", async () => {
    const res = await searchTechGET();
    await checkEnvelope(res);
  });

  it("GET /api/search/architectures", async () => {
    const res = await searchArchGET();
    await checkEnvelope(res);
  });

  it("GET /api/debug/cache (development mode checks)", async () => {
    const res = await debugCacheGET();
    await checkEnvelope(res);
  });

  it("POST /api/debug/cache (development mode checks)", async () => {
    const res = await debugCachePOST();
    await checkEnvelope(res);
  });

  it("GET /api/debug/repositories", async () => {
    const res = await debugRepositoriesGET();
    await checkEnvelope(res);
  });

  // POST AI routes
  it("POST /api/ai/summary", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ repository: "test", title: "fix", body: "detail" })
    });
    const res = await aiSummaryPOST(req);
    await checkEnvelope(res);
  });

  it("POST /api/ai/complexity", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ repository: "test", title: "fix", body: "detail" })
    });
    const res = await aiComplexityPOST(req);
    await checkEnvelope(res);
  });

  it("POST /api/ai/concepts", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ repository: "test", title: "fix", body: "detail" })
    });
    const res = await aiConceptsPOST(req);
    await checkEnvelope(res);
  });

  it("POST /api/ai/contribution-plan", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ repository: "test", title: "fix", body: "detail" })
    });
    const res = await aiPlanPOST(req);
    await checkEnvelope(res);
  });

  it("POST /api/ai/learning-path", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ repository: "test", title: "fix", body: "detail" })
    });
    const res = await aiLearningPOST(req);
    await checkEnvelope(res);
  });

  it("POST /api/ai/repository-summary", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ name: "test", fullName: "test/test", description: "Ok" })
    });
    const res = await aiRepoSummaryPOST(req);
    await checkEnvelope(res);
  });

  // Mentor routes
  it("GET /api/repositories/[owner]/[repo]/issues/[number]/mentor/session", async () => {
    const params = Promise.resolve({ owner: "test", repo: "repo", number: "1" });
    const res = await mentorSessionGET(new Request("http://localhost"), { params });
    await checkEnvelope(res);
  });

  it("GET /api/repositories/[owner]/[repo]/issues/[number]/mentor/reading-order", async () => {
    const params = Promise.resolve({ owner: "test", repo: "repo", number: "1" });
    const res = await mentorReadingGET(new Request("http://localhost"), { params });
    await checkEnvelope(res);
  });

  it("GET /api/repositories/[owner]/[repo]/issues/[number]/mentor/strategy", async () => {
    const params = Promise.resolve({ owner: "test", repo: "repo", number: "1" });
    const res = await mentorStrategyGET(new Request("http://localhost"), { params });
    await checkEnvelope(res);
  });

  it("GET /api/repositories/[owner]/[repo]/issues/[number]/mentor/debugging", async () => {
    const params = Promise.resolve({ owner: "test", repo: "repo", number: "1" });
    const res = await mentorDebuggingGET(new Request("http://localhost"), { params });
    await checkEnvelope(res);
  });

  it("GET /api/repositories/[owner]/[repo]/issues/[number]/mentor/checklist", async () => {
    const params = Promise.resolve({ owner: "test", repo: "repo", number: "1" });
    const res = await mentorChecklistGET(new Request("http://localhost"), { params });
    await checkEnvelope(res);
  });
});
