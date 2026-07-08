import type { IssueContext } from "../types";
import type { AIChatMessage } from "../types";

export const CONCEPT_EXTRACTION_PROMPT_VERSION = "v1";

export function buildConceptExtractionPrompt(context: IssueContext): AIChatMessage[] {
  return [
    {
      role: "system",
      content: `You are a senior software engineer extracting technical concepts from a GitHub issue.
Respond ONLY with valid JSON matching this exact structure:
{
  "frameworks": ["string"],
  "libraries": ["string"],
  "patterns": ["string"],
  "algorithms": ["string"],
  "protocols": ["string"],
  "languages": ["string"],
  "tools": ["string"]
}
Return empty arrays for categories with no matches. No markdown. No explanation. JSON only.`,
    },
    {
      role: "user",
      content: `Extract technical concepts from this issue:

Title: ${context.title}
Repository: ${context.repository}
Language: ${context.language ?? "Unknown"}
Labels: ${context.labels.join(", ") || "None"}

Description:
${context.body.slice(0, 3000)}`,
    },
  ];
}
