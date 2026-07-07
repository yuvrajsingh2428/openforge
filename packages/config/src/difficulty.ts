export interface DifficultyThresholds {
  readonly maxLinesForBeginner: number;
  readonly maxLabelsForBeginner: number;
  readonly goodFirstIssueLabels: ReadonlyArray<string>;
  readonly helpWantedLabels: ReadonlyArray<string>;
  readonly documentationLabels: ReadonlyArray<string>;
  readonly bugLabels: ReadonlyArray<string>;
  readonly featureLabels: ReadonlyArray<string>;
}

export const DIFFICULTY_THRESHOLDS: DifficultyThresholds = {
  maxLinesForBeginner: 200,
  maxLabelsForBeginner: 3,
  goodFirstIssueLabels: ["good first issue", "good-first-issue", "beginner", "starter", "easy"],
  helpWantedLabels: ["help wanted", "help-wanted", "contributions welcome"],
  documentationLabels: ["documentation", "docs", "doc"],
  bugLabels: ["bug", "fix", "defect", "error"],
  featureLabels: ["feature", "enhancement", "improvement", "feature request"],
} as const;
