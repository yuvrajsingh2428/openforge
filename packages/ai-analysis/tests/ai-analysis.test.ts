import { describe, it, expect } from "vitest";
import { parseAIResponse } from "../src/parsers";
import { InMemoryCache, buildCacheKey } from "../src/cache";
import { buildIssueSummaryPrompt } from "../src/prompts/issue-summary";
import { buildContributionPlanPrompt } from "../src/prompts/contribution-plan";
import { buildRepositorySummaryPrompt } from "../src/prompts/repository-summary";
import { buildLearningPathPrompt } from "../src/prompts/learning-path";
import { buildConceptExtractionPrompt } from "../src/prompts/concept-extraction";
import { buildComplexityAnalysisPrompt } from "../src/prompts/complexity-analysis";
import {
  IssueSummarySchema,
  ContributionPlanSchema,
  RepositorySummarySchema,
  LearningPathSchema,
  ConceptListSchema,
  ComplexityAnalysisSchema,
} from "../src/schemas";
import type { IssueContext, RepositoryContext } from "../src/types";

const issueContext: IssueContext = {
  title: "Add streaming support for agent responses",
  body: "We need to implement streaming for LLM agent responses. This involves refactoring the API layer, adding WebSocket support, and comprehensive test coverage.",
  labels: ["enhancement", "good first issue"],
  repository: "test/repo",
  language: "TypeScript",
  state: "OPEN",
  commentCount: 5,
};

const repoContext: RepositoryContext = {
  name: "repo",
  fullName: "test/repo",
  description: "An AI agent framework for building production LLM applications",
  language: "TypeScript",
  stars: 15000,
  forks: 3000,
  topics: ["ai", "agent", "typescript"],
  hasLicense: true,
  openIssueCount: 200,
};

describe("Parser", () => {
  it("parses clean JSON", () => {
    const raw = '{"what":"test","why":"reason","expectedChanges":["a"],"technologies":["ts"]}';
    const result = parseAIResponse(raw, IssueSummarySchema);
    expect(result.what).toBe("test");
  });

  it("parses JSON wrapped in markdown fences", () => {
    const raw = '```json\n{"what":"test","why":"reason","expectedChanges":[],"technologies":[]}\n```';
    const result = parseAIResponse(raw, IssueSummarySchema);
    expect(result.what).toBe("test");
  });

  it("parses JSON with surrounding text", () => {
    const raw = 'Here is the analysis:\n{"what":"test","why":"reason","expectedChanges":[],"technologies":[]}\nDone.';
    const result = parseAIResponse(raw, IssueSummarySchema);
    expect(result.what).toBe("test");
  });

  it("throws on invalid JSON", () => {
    expect(() => parseAIResponse("not json", IssueSummarySchema)).toThrow();
  });

  it("throws on schema mismatch", () => {
    expect(() => parseAIResponse('{"wrong":"shape"}', IssueSummarySchema)).toThrow();
  });
});

describe("Cache", () => {
  it("stores and retrieves values", () => {
    const cache = new InMemoryCache();
    cache.set("key", { value: 42 });
    expect(cache.get<{ value: number }>("key")?.value).toBe(42);
  });

  it("respects TTL", async () => {
    const cache = new InMemoryCache(50); // 50ms TTL
    cache.set("key", "value");
    expect(cache.get("key")).toBe("value");
    await new Promise((r) => setTimeout(r, 60));
    expect(cache.get("key")).toBeNull();
  });

  it("invalidates a specific key", () => {
    const cache = new InMemoryCache();
    cache.set("key", "value");
    cache.invalidate("key");
    expect(cache.get("key")).toBeNull();
  });

  it("clears all entries", () => {
    const cache = new InMemoryCache();
    cache.set("a", 1);
    cache.set("b", 2);
    cache.clear();
    expect(cache.get("a")).toBeNull();
    expect(cache.get("b")).toBeNull();
  });

  it("builds deterministic cache keys", () => {
    const key = buildCacheKey("summary", "test/repo#42", "v1", "llama3.2");
    expect(key).toBe("summary:test/repo#42:v1:llama3.2");
  });
});

describe("Prompts", () => {
  it("builds issue summary prompt", () => {
    const messages = buildIssueSummaryPrompt(issueContext);
    expect(messages.length).toBe(2);
    expect(messages[0].role).toBe("system");
    expect(messages[1].role).toBe("user");
    expect(messages[1].content).toContain("Add streaming support");
  });

  it("builds contribution plan prompt", () => {
    const messages = buildContributionPlanPrompt(issueContext);
    expect(messages.length).toBe(2);
    expect(messages[1].content).toContain("Add streaming support");
  });

  it("builds repository summary prompt", () => {
    const messages = buildRepositorySummaryPrompt(repoContext);
    expect(messages.length).toBe(2);
    expect(messages[1].content).toContain("test/repo");
  });

  it("builds learning path prompt", () => {
    const messages = buildLearningPathPrompt(issueContext);
    expect(messages.length).toBe(2);
    expect(messages[1].content).toContain("TypeScript");
  });

  it("builds concept extraction prompt", () => {
    const messages = buildConceptExtractionPrompt(issueContext);
    expect(messages.length).toBe(2);
    expect(messages[0].content).toContain("frameworks");
  });

  it("builds complexity analysis prompt", () => {
    const messages = buildComplexityAnalysisPrompt(issueContext);
    expect(messages.length).toBe(2);
    expect(messages[1].content).toContain("Comments: 5");
  });
});

describe("Schemas", () => {
  it("validates IssueSummary", () => {
    const valid = { what: "x", why: "y", expectedChanges: ["a"], technologies: ["b"] };
    expect(IssueSummarySchema.parse(valid)).toEqual(valid);
  });

  it("validates ContributionPlan", () => {
    const valid = { firstSteps: ["a"], readingOrder: ["b"], implementationChecklist: ["c"], testingChecklist: ["d"], validationChecklist: ["e"] };
    expect(ContributionPlanSchema.parse(valid)).toEqual(valid);
  });

  it("validates RepositorySummary", () => {
    const valid = { purpose: "a", architecture: "b", keyTechnologies: ["c"], contributorExpectations: "d", learningOpportunities: ["e"] };
    expect(RepositorySummarySchema.parse(valid)).toEqual(valid);
  });

  it("validates LearningPath", () => {
    const valid = { prerequisites: ["a"], recommendedKnowledge: ["b"], documentation: ["c"], conceptProgression: ["d"], estimatedHours: 10 };
    expect(LearningPathSchema.parse(valid)).toEqual(valid);
  });

  it("validates ConceptList", () => {
    const valid = { frameworks: [], libraries: [], patterns: [], algorithms: [], protocols: [], languages: [], tools: [] };
    expect(ConceptListSchema.parse(valid)).toEqual(valid);
  });

  it("validates ComplexityAnalysis", () => {
    const valid = { level: "medium", reasoning: "reason", factors: ["f1"] };
    expect(ComplexityAnalysisSchema.parse(valid)).toEqual(valid);
  });

  it("rejects invalid ComplexityAnalysis level", () => {
    expect(() => ComplexityAnalysisSchema.parse({ level: "extreme", reasoning: "x", factors: [] })).toThrow();
  });
});
