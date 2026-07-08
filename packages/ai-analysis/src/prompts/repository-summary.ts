import type { RepositoryContext } from "../types";
import type { AIChatMessage } from "../types";

export const REPOSITORY_SUMMARY_PROMPT_VERSION = "v1";

export function buildRepositorySummaryPrompt(context: RepositoryContext): AIChatMessage[] {
  return [
    {
      role: "system",
      content: `You are a senior software engineer analyzing an open-source repository.
Respond ONLY with valid JSON matching this exact structure:
{
  "purpose": "string - what the repository does",
  "architecture": "string - architecture overview",
  "keyTechnologies": ["string - key technologies used"],
  "contributorExpectations": "string - what contributors should expect",
  "learningOpportunities": ["string - what you can learn from contributing"]
}
No markdown. No explanation. JSON only.`,
    },
    {
      role: "user",
      content: `Analyze this repository:

Name: ${context.fullName}
Description: ${context.description}
Language: ${context.language ?? "Unknown"}
Stars: ${context.stars}
Forks: ${context.forks}
Topics: ${context.topics.join(", ") || "None"}
Open Issues: ${context.openIssueCount}
License: ${context.hasLicense ? "Yes" : "No"}`,
    },
  ];
}
