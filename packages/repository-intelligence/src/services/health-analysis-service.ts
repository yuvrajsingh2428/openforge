import { HealthScore, HealthSignals, HealthBreakdown, HealthExplanation } from "../types";

export interface RepositoryHealthInput {
  commitFrequency: number; // Commits per week or month
  recentReleases: number; // Number of releases in last 6 months
  openIssues: number;
  closedIssues: number;
  avgIssueResponseTimeDays: number;
  hasReadme: boolean;
  hasContributing: boolean;
  hasLicense: boolean;
  hasCodeOfConduct: boolean;
  repositoryAgeDays: number;
  stars: number;
  forks: number;
}

interface HealthRule {
  name: string;
  category: keyof HealthBreakdown;
  evaluate: (signals: HealthSignals) => { score: number; maxScore: number; strength?: string; weakness?: string; suggestion?: string };
}

const HEALTH_RULES: HealthRule[] = [
  {
    name: 'Documentation completeness',
    category: 'documentationScore',
    evaluate: (s) => {
      let score = 0;
      if (s.hasReadme) score += 40;
      if (s.hasContributing) score += 30;
      if (s.hasLicense) score += 20;
      if (s.hasCodeOfConduct) score += 10;
      
      return {
        score,
        maxScore: 100,
        strength: score >= 80 ? 'Excellent documentation practices.' : undefined,
        weakness: score < 50 ? 'Missing key community documents.' : undefined,
        suggestion: score < 100 ? 'Add missing documentation files (README, CONTRIBUTING, LICENSE, CODE_OF_CONDUCT).' : undefined
      };
    }
  },
  {
    name: 'Activity frequency',
    category: 'activityScore',
    evaluate: (s) => {
      const score = (s.commitFrequency * 0.7 + s.releaseActivity * 0.3) * 100;
      return {
        score,
        maxScore: 100,
        strength: score >= 80 ? 'High commit and release activity.' : undefined,
        weakness: score < 30 ? 'Low repository activity.' : undefined,
        suggestion: score < 50 ? 'Encourage more frequent commits and releases.' : undefined
      };
    }
  },
  {
    name: 'Community health',
    category: 'communityScore',
    evaluate: (s) => {
      const score = (s.maintainerResponsiveness * 0.6 + s.repositoryPopularity * 0.4) * 100;
      return {
        score,
        maxScore: 100,
        strength: s.maintainerResponsiveness > 0.8 ? 'Maintainers are very responsive to issues.' : undefined,
        weakness: s.maintainerResponsiveness < 0.3 ? 'Slow issue response times.' : undefined,
        suggestion: s.maintainerResponsiveness < 0.5 ? 'Improve response times to issues and PRs.' : undefined
      };
    }
  },
  {
    name: 'Maintenance balance',
    category: 'maintenanceScore',
    evaluate: (s) => {
      const score = (1 - s.openIssueRatio) * 100;
      return {
        score,
        maxScore: 100,
        strength: score >= 80 ? 'Good balance of open vs closed issues.' : undefined,
        weakness: score < 50 ? 'High ratio of open issues to closed issues.' : undefined,
        suggestion: score < 70 ? 'Close stale issues or dedicate time to resolving backlog.' : undefined
      };
    }
  }
];

export class HealthAnalysisService {
  public analyze(input: RepositoryHealthInput): HealthScore {
    const signals = this.calculateSignals(input);
    
    const breakdown = {
      activityScore: 0,
      communityScore: 0,
      maintenanceScore: 0,
      documentationScore: 0,
    };
    
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    
    for (const rule of HEALTH_RULES) {
      const result = rule.evaluate(signals);
      breakdown[rule.category] = Math.round(result.score);
      if (result.strength) strengths.push(result.strength);
      if (result.weakness) weaknesses.push(result.weakness);
      if (result.suggestion) suggestions.push(result.suggestion);
    }
    
    const totalScore = this.calculateTotalScore(breakdown);
    
    let summary = "This repository is in average health.";
    if (totalScore >= 80) summary = "This repository is in excellent health.";
    else if (totalScore < 50) summary = "This repository is in poor health and may be abandoned or unmaintained.";
    
    const explanation = { summary, strengths, weaknesses, suggestions };

    return {
      totalScore,
      breakdown,
      signals,
      explanation,
    };
  }

  private calculateSignals(input: RepositoryHealthInput): HealthSignals {
    const totalIssues = input.openIssues + input.closedIssues;
    const openIssueRatio = totalIssues === 0 ? 0 : input.openIssues / totalIssues;
    
    let maintainerResponsiveness = 0;
    if (input.avgIssueResponseTimeDays >= 0) {
      maintainerResponsiveness = Math.max(0, 1 - (input.avgIssueResponseTimeDays / 14));
    }
    
    let docScore = 0;
    if (input.hasReadme) docScore += 0.4;
    if (input.hasContributing) docScore += 0.3;
    if (input.hasLicense) docScore += 0.2;
    if (input.hasCodeOfConduct) docScore += 0.1;

    const popularity = Math.min(1, (input.stars * 2 + input.forks * 10) / 1000);

    return {
      commitFrequency: Math.min(1, input.commitFrequency / 10),
      releaseActivity: Math.min(1, input.recentReleases / 5),
      openIssueRatio: openIssueRatio,
      maintainerResponsiveness,
      documentationQuality: docScore,
      hasReadme: input.hasReadme,
      hasContributing: input.hasContributing,
      hasLicense: input.hasLicense,
      hasCodeOfConduct: input.hasCodeOfConduct,
      repositoryAgeDays: input.repositoryAgeDays,
      repositoryPopularity: popularity,
    };
  }

  private calculateTotalScore(breakdown: HealthBreakdown): number {
    const total = 
      breakdown.activityScore * 0.3 +
      breakdown.communityScore * 0.2 +
      breakdown.maintenanceScore * 0.3 +
      breakdown.documentationScore * 0.2;
    
    return Math.round(total);
  }
}
