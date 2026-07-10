import type { NodeType, EdgeType } from "@openforge/repository-intelligence";

export interface Concept {
  name: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface ReadingItem {
  path: string;
  explanation: string;
}

export interface StrategyStep {
  stepNumber: number;
  title: string;
  guidelines: string;
}

export interface DebugGuide {
  rootCauses: string[];
  relevantFiles: string[];
  affectedTests: string[];
  logsToWatch: string[];
  verificationSteps: string[];
}

export interface ReviewItem {
  id: string;
  category: "Tests" | "Formatting" | "Documentation" | "Edge Cases" | "Backward Compatibility";
  description: string;
  verificationMethod: string;
}

export interface MentorSession {
  repoOwner: string;
  repoName: string;
  issueNumber: number;
  generatedAt: string;
  repositoryOverview: string;
  issueUnderstanding: string;
  concepts: Concept[];
  prerequisites: string[];
  readingOrder: ReadingItem[];
  strategySteps: StrategyStep[];
  debugGuide: DebugGuide;
  reviewChecklist: ReviewItem[];
  learningOutcomes: string[];
  commonMistakes: string[];
  warnings: string[];
}
