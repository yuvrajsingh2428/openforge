import type { IssueContext } from "../types";
import type { AIChatMessage } from "../types";

export const CONTRIBUTION_PLAN_PROMPT_VERSION = "v1";

export function buildContributionPlanPrompt(context: IssueContext): AIChatMessage[] {
  return [
    {
      role: "system",
      content: `You are a senior software engineer creating a contribution plan for a developer who wants to solve a GitHub issue.
Respond ONLY with valid JSON matching this exact structure:
{
  "firstSteps": ["string - ordered first steps to start contributing"],
  "readingOrder": ["string - files/docs to read in order"],
  "implementationChecklist": ["string - implementation steps"],
  "testingChecklist": ["string - testing steps"],
  "validationChecklist": ["string - pre-PR validation steps"]
}
No markdown. No explanation. JSON only.`,
    },
    {
      role: "user",
      content: `Create a contribution plan for this issue:

Title: ${context.title}
Repository: ${context.repository}
Language: ${context.language ?? "Unknown"}
Labels: ${context.labels.join(", ") || "None"}

Description:
${context.body.slice(0, 3000)}`,
    },
  ];
}
