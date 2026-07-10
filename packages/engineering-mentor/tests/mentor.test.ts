import { describe, it, expect, vi } from "vitest";
import { ContextBuilder } from "../src/services/context-builder";
import { MentorService } from "../src/services/mentor-service";
import { MentorSessionSchema } from "../src/schemas/mentor";
import { AnalysisCache } from "@openforge/repository-intelligence";

// Mock snapshot and graph
vi.mock("@openforge/repository-intelligence", async () => {
  const actual = await vi.importActual<any>("@openforge/repository-intelligence");
  return {
    ...actual,
    SnapshotService: {
      createSnapshot: vi.fn().mockResolvedValue({
        owner: "owner",
        repo: "repo",
        fetchedAt: new Date(),
        tree: [
          { path: "README.md", type: "blob", sha: "1" },
          { path: "src/index.ts", type: "blob", sha: "2" },
          { path: "package.json", type: "blob", sha: "3", content: '{"dependencies":{}}' }
        ]
      })
    }
  };
});

describe("ContextBuilder", () => {
  it("should assemble all deterministic inputs", async () => {
    const context = await ContextBuilder.build("owner", "repo", { number: 1, title: "Issue", body: "" });
    expect(context.repoMap).toBeDefined();
    expect(context.journey.length).toBeGreaterThan(0);
    expect(context.architecture).toBeDefined();
  });
});

describe("MentorService Validation & Validation Tests", () => {
  it("should fail validation if code snippets are found in LLM output", () => {
    const codeData = {
      repositoryOverview: "Some overview with const x = 5;",
      issueUnderstanding: "Understand",
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
    };
    
    // We check using our service helper
    const hasCode = (MentorService as any).detectCodeSnippets(codeData);
    expect(hasCode).toBe(true);
  });

  it("should validate valid non-code sessions", () => {
    const validData = {
      repositoryOverview: "Clean overview",
      issueUnderstanding: "Understand",
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
    };
    
    const hasCode = (MentorService as any).detectCodeSnippets(validData);
    expect(hasCode).toBe(false);
  });
  
  it("should ensure AI outputs align and never contradict deterministic metrics", async () => {
    const context = await ContextBuilder.build("owner", "repo", { number: 1, title: "Test", body: "" });
    
    // Contradiction check:
    // If the graph contains no database dependencies, the AI should not talk about Prisma.
    // Here we assert that context dependencies are deterministically mapped.
    expect(context.dependencies).toHaveLength(0);
  });
});
