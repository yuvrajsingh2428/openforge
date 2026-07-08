import { bench, describe } from 'vitest';
import { HealthAnalysisService } from '@openforge/repository-intelligence/src/services/health-analysis-service';

describe('Repository Health Performance', () => {
  const service = new HealthAnalysisService();
  const input = {
    commitFrequency: 50,
    recentReleases: 2,
    openIssues: 10,
    closedIssues: 100,
    avgIssueResponseTimeDays: 1.5,
    hasReadme: true,
    hasContributing: true,
    hasLicense: true,
    hasCodeOfConduct: true,
    repositoryAgeDays: 365,
    stars: 1000,
    forks: 200
  };

  bench('analyze health', () => {
    service.analyze(input);
  });
});
