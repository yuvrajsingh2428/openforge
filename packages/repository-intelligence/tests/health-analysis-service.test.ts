import { describe, it, expect } from "vitest";
import { HealthAnalysisService, RepositoryHealthInput } from "../src/services/health-analysis-service";

describe("HealthAnalysisService", () => {
  const service = new HealthAnalysisService();

  const mockInput: RepositoryHealthInput = {
    commitFrequency: 10,
    recentReleases: 5,
    openIssues: 10,
    closedIssues: 90,
    avgIssueResponseTimeDays: 1,
    hasReadme: true,
    hasContributing: true,
    hasLicense: true,
    hasCodeOfConduct: true,
    repositoryAgeDays: 365,
    stars: 1000,
    forks: 200,
  };

  it("should calculate health score deterministically for excellent repo", () => {
    const result = service.analyze(mockInput);
    
    expect(result.totalScore).toBeGreaterThan(80);
    expect(result.breakdown.documentationScore).toBe(100);
    expect(result.explanation.summary).toBe("This repository is in excellent health.");
  });

  it("should calculate health score deterministically for poor repo", () => {
    const poorInput: RepositoryHealthInput = {
      ...mockInput,
      commitFrequency: 0,
      recentReleases: 0,
      openIssues: 100,
      closedIssues: 0,
      avgIssueResponseTimeDays: 30,
      hasReadme: false,
      hasContributing: false,
      hasLicense: false,
      hasCodeOfConduct: false,
      stars: 0,
      forks: 0,
    };
    const result = service.analyze(poorInput);
    
    expect(result.totalScore).toBeLessThan(50);
    expect(result.breakdown.documentationScore).toBe(0);
    expect(result.explanation.summary).toBe("This repository is in poor health and may be abandoned or unmaintained.");
  });
});
