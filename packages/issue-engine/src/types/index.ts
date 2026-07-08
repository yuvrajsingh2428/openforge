export type ContributionSize = "XS" | "S" | "M" | "L" | "XL";

export interface ContributionEstimate {
  size: ContributionSize;
  confidence: number; // 0 to 1
  estimatedEffortDays?: number;
  reasons: string[];
}

export interface ContributionInput {
  labels: string[];
  bodyLength: number;
  commentsCount: number;
  issueAgeDays: number;
  repositoryMaturityScore: number; // 0 to 100
  assigneesCount: number;
}
