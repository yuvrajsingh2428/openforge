import type { IssueContext } from "../types";
import type { AIChatMessage } from "../types";

export const ISSUE_SUMMARY_PROMPT_VERSION = "v1";

export function buildIssueSummaryPrompt(context: IssueContext): AIChatMessage[] {
  return [
    {
      role: "system",
      content: `You are a senior software engineer analyzing GitHub issues.
Respond ONLY with valid JSON matching this exact structure:
{
  "what": "string - concise explanation of what the issue is",
  "why": "string - why it matters",
  "expectedChanges": ["string - list of expected code changes"],
  "technologies": ["string - technologies involved"]
}
No markdown. No explanation. JSON only.`,
    },
    {
      role: "user",
      content: `Analyze this GitHub issue:

Title: ${context.title}
Repository: ${context.repository}
Language: ${context.language ?? "Unknown"}
State: ${context.state}
Labels: ${context.labels.join(", ") || "None"}
Comments: ${context.commentCount}

Description:
${context.body.slice(0, 3000)}`,
    },
  ];
}
