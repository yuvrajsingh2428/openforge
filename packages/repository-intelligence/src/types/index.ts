export interface HealthSignals {
  commitFrequency: number;
  releaseActivity: number;
  openIssueRatio: number;
  maintainerResponsiveness: number;
  documentationQuality: number;
  hasReadme: boolean;
  hasContributing: boolean;
  hasLicense: boolean;
  hasCodeOfConduct: boolean;
  repositoryAgeDays: number;
  repositoryPopularity: number;
}

export interface HealthBreakdown {
  activityScore: number;
  communityScore: number;
  maintenanceScore: number;
  documentationScore: number;
}

export interface HealthExplanation {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface HealthScore {
  totalScore: number;
  breakdown: HealthBreakdown;
  signals: HealthSignals;
  explanation: HealthExplanation;
}
