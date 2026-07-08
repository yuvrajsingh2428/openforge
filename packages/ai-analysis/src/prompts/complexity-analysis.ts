import type { IssueContext } from "../types";
import type { AIChatMessage } from "../types";

export const COMPLEXITY_ANALYSIS_PROMPT_VERSION = "v1";

export function buildComplexityAnalysisPrompt(context: IssueContext): AIChatMessage[] {
  return [
    {
      role: "system",
      content: `You are a senior software engineer estimating the complexity of a GitHub issue.
Respond ONLY with valid JSON matching this exact structure:
{
  "level": "low" | "medium" | "high" | "very-high",
  "reasoning": "string - why this complexity level was assigned",
  "factors": ["string - factors contributing to complexity"]
}
No markdown. No explanation. JSON only.`,
    },
    {
      role: "user",
      content: `Estimate the complexity of this issue:

Title: ${context.title}
Repository: ${context.repository}
Language: ${context.language ?? "Unknown"}
Labels: ${context.labels.join(", ") || "None"}
Comments: ${context.commentCount}

Description:
${context.body.slice(0, 3000)}`,
    },
  ];
}
