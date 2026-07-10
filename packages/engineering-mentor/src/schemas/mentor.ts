import { z } from "zod";

export const ConceptSchema = z.object({
  name: z.string(),
  description: z.string(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"])
});

export const ReadingItemSchema = z.object({
  path: z.string(),
  explanation: z.string()
});

export const StrategyStepSchema = z.object({
  stepNumber: z.number(),
  title: z.string(),
  guidelines: z.string()
});

export const DebugGuideSchema = z.object({
  rootCauses: z.array(z.string()),
  relevantFiles: z.array(z.string()),
  affectedTests: z.array(z.string()),
  logsToWatch: z.array(z.string()),
  verificationSteps: z.array(z.string())
});

export const ReviewItemSchema = z.object({
  id: z.string(),
  category: z.enum(["Tests", "Formatting", "Documentation", "Edge Cases", "Backward Compatibility"]),
  description: z.string(),
  verificationMethod: z.string()
});

export const MentorSessionSchema = z.object({
  repoOwner: z.string(),
  repoName: z.string(),
  issueNumber: z.number(),
  generatedAt: z.string(),
  repositoryOverview: z.string(),
  issueUnderstanding: z.string(),
  concepts: z.array(ConceptSchema),
  prerequisites: z.array(z.string()),
  readingOrder: z.array(ReadingItemSchema),
  strategySteps: z.array(StrategyStepSchema),
  debugGuide: z.object({
    rootCauses: z.array(z.string()),
    relevantFiles: z.array(z.string()),
    affectedTests: z.array(z.string()),
    logsToWatch: z.array(z.string()),
    verificationSteps: z.array(z.string())
  }),
  reviewChecklist: z.array(ReviewItemSchema),
  learningOutcomes: z.array(z.string()),
  commonMistakes: z.array(z.string()),
  warnings: z.array(z.string())
});
