import { z } from "zod";

export const LearningResourceSchema = z.object({
  title: z.string().describe("Resource title"),
  url: z.string().optional().describe("URL to documentation or resource if available"),
  reason: z.string().describe("Why this resource helps with the issue"),
});

export const IssueAnalysisSchema = z.object({
  summary: z.string().describe("Executive summary of what the issue is about"),
  beginnerExplanation: z.string().describe("Plain English explanation for a beginner contributor"),
  whyItMatters: z.string().describe("Impact and importance of resolving this issue"),
  requiredSkills: z.array(z.string()).describe("Skills required to address the issue"),
  conceptsToLearn: z.array(z.string()).describe("Key concepts the contributor will learn"),
  estimatedDifficulty: z.enum(["Easy", "Medium", "Hard"]).describe("Relative implementation difficulty"),
  estimatedHours: z.number().describe("Estimated hours needed to implement and test"),
  confidence: z.number().min(0).max(1).describe("AI confidence score between 0 and 1"),
  likelyFiles: z.array(z.string()).describe("Files likely involved in fixing this issue"),
  implementationStrategy: z.array(z.string()).describe("Step-by-step strategy for resolving the issue"),
  testingStrategy: z.array(z.string()).describe("Strategy and steps for testing the fix"),
  commonPitfalls: z.array(z.string()).describe("Common pitfalls or mistakes to avoid"),
  learningResources: z.array(LearningResourceSchema).describe("Curated list of learning resources"),
});

export type LearningResource = z.infer<typeof LearningResourceSchema>;
export type IssueAnalysis = z.infer<typeof IssueAnalysisSchema>;
