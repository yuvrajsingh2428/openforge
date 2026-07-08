import { z } from "zod";

export const IssueSummarySchema = z.object({
  what: z.string().describe("What the issue is about"),
  why: z.string().describe("Why the issue matters"),
  expectedChanges: z.array(z.string()).describe("Expected code changes"),
  technologies: z.array(z.string()).describe("Technologies involved"),
});

export const ContributionPlanSchema = z.object({
  firstSteps: z.array(z.string()).describe("First steps to get started"),
  readingOrder: z.array(z.string()).describe("Suggested reading order for relevant files"),
  implementationChecklist: z.array(z.string()).describe("Implementation steps"),
  testingChecklist: z.array(z.string()).describe("Testing steps"),
  validationChecklist: z.array(z.string()).describe("Validation steps before submitting PR"),
});

export const RepositorySummarySchema = z.object({
  purpose: z.string().describe("What the repository does"),
  architecture: z.string().describe("Architecture overview"),
  keyTechnologies: z.array(z.string()).describe("Key technologies used"),
  contributorExpectations: z.string().describe("What contributors should expect"),
  learningOpportunities: z.array(z.string()).describe("What you can learn"),
});

export const LearningPathSchema = z.object({
  prerequisites: z.array(z.string()).describe("Required knowledge"),
  recommendedKnowledge: z.array(z.string()).describe("Recommended but not required"),
  documentation: z.array(z.string()).describe("Suggested documentation to read"),
  conceptProgression: z.array(z.string()).describe("Order of concepts to learn"),
  estimatedHours: z.number().describe("Estimated learning time in hours"),
});

export const ConceptListSchema = z.object({
  frameworks: z.array(z.string()),
  libraries: z.array(z.string()),
  patterns: z.array(z.string()),
  algorithms: z.array(z.string()),
  protocols: z.array(z.string()),
  languages: z.array(z.string()),
  tools: z.array(z.string()),
});

export const ComplexityAnalysisSchema = z.object({
  level: z.enum(["low", "medium", "high", "very-high"]),
  reasoning: z.string().describe("Why this complexity level was assigned"),
  factors: z.array(z.string()).describe("Factors contributing to complexity"),
});

export type IssueSummary = z.infer<typeof IssueSummarySchema>;
export type ContributionPlan = z.infer<typeof ContributionPlanSchema>;
export type RepositorySummary = z.infer<typeof RepositorySummarySchema>;
export type LearningPath = z.infer<typeof LearningPathSchema>;
export type ConceptList = z.infer<typeof ConceptListSchema>;
export type ComplexityAnalysis = z.infer<typeof ComplexityAnalysisSchema>;
