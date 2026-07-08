import type { IssueContext } from "../types";
import type { AIChatMessage } from "../types";

export const LEARNING_PATH_PROMPT_VERSION = "v1";

export function buildLearningPathPrompt(context: IssueContext): AIChatMessage[] {
  return [
    {
      role: "system",
      content: `You are a senior software engineer creating a learning path for a developer who wants to contribute to an open-source project.
Respond ONLY with valid JSON matching this exact structure:
{
  "prerequisites": ["string - required knowledge"],
  "recommendedKnowledge": ["string - recommended but not required knowledge"],
  "documentation": ["string - suggested documentation to read"],
  "conceptProgression": ["string - concepts to learn in order"],
  "estimatedHours": number
}
No markdown. No explanation. JSON only.`,
    },
    {
      role: "user",
      content: `Create a learning path for contributing to this issue:

Title: ${context.title}
Repository: ${context.repository}
Language: ${context.language ?? "Unknown"}
Labels: ${context.labels.join(", ") || "None"}

Description:
${context.body.slice(0, 3000)}`,
    },
  ];
}
