import { describe, it, expect } from "vitest";
import { IssueAnalysisSchema } from "../src/schemas/issue-analysis";

describe("IssueAnalysisSchema", () => {
  const validData = {
    summary: "Fix memory leak in websocket event listener",
    beginnerExplanation: "When connections close, listeners are not removed.",
    whyItMatters: "Prevents memory buildup in production servers.",
    requiredSkills: ["TypeScript", "WebSockets"],
    conceptsToLearn: ["Event Emitter cleanup", "Memory Profiling"],
    estimatedDifficulty: "Medium" as const,
    estimatedHours: 3,
    confidence: 0.9,
    likelyFiles: ["src/socket/connection.ts", "tests/socket.test.ts"],
    implementationStrategy: ["Locate listener registration", "Add cleanup in disconnect handler"],
    testingStrategy: ["Simulate 1000 connect/disconnect cycles", "Assert memory remains stable"],
    commonPitfalls: ["Forgetting edge-case disconnects on network drop"],
    learningResources: [
      {
        title: "Node.js Event Emitter Memory Leak Detection",
        url: "https://nodejs.org/docs/latest/api/events.html",
        reason: "Explains listener limits and cleanup patterns",
      },
    ],
  };

  it("validates correct issue analysis structure", () => {
    const result = IssueAnalysisSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails on invalid difficulty enum", () => {
    const invalid = { ...validData, estimatedDifficulty: "SuperHard" };
    const result = IssueAnalysisSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("fails on confidence out of bounds", () => {
    const invalid = { ...validData, confidence: 1.5 };
    const result = IssueAnalysisSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("fails when required fields are missing", () => {
    const invalid = { ...validData, summary: undefined };
    const result = IssueAnalysisSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
