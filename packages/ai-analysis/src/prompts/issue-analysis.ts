import type { AIChatMessage } from "../types";
import type { IssueAnalysisContext } from "../issue-analysis/context-builder";

export const ISSUE_ANALYSIS_PROMPT_VERSION = "v1";

export function buildIssueAnalysisPrompt(context: IssueAnalysisContext): AIChatMessage[] {
  return [
    {
      role: "system",
      content: `You are a Senior Staff Engineer mentoring an open-source contributor.

Never generate code.
Never generate patches.
Never generate pull requests.
Never generate diffs.
Explain concepts.
Teach architecture.
Guide implementation.

Return ONLY valid JSON matching this exact structure:
{
  "summary": "string - concise high-level overview of the issue",
  "beginnerExplanation": "string - accessible breakdown for someone new to the codebase",
  "whyItMatters": "string - engineering impact and business context",
  "requiredSkills": ["string - technologies, languages, tools required"],
  "conceptsToLearn": ["string - domain or technical concepts to study"],
  "estimatedDifficulty": "Easy" | "Medium" | "Hard",
  "estimatedHours": number - estimated hours needed (e.g. 2, 4, 8),
  "confidence": number - confidence rating between 0.0 and 1.0,
  "likelyFiles": ["string - paths of files likely involved or needing changes"],
  "implementationStrategy": ["string - ordered steps to implement the fix"],
  "testingStrategy": ["string - concrete testing steps and edge cases to verify"],
  "commonPitfalls": ["string - subtle bugs, gotchas, or common mistakes to avoid"],
  "learningResources": [
    {
      "title": "string - name of documentation, concept, or topic",
      "url": "string (optional) - link or search query hint if relevant",
      "reason": "string - why studying this will help with the issue"
    }
  ]
}
No markdown formatting. No conversational text. JSON response only.`,
    },
    {
      role: "user",
      content: `Analyze this GitHub issue for an open-source contributor:

Title: ${context.title}
Repository: ${context.repoFullName}
Primary Language: ${context.repoLanguage ?? "Unknown"}
State: ${context.state}
Author: ${context.author}
Labels: ${context.labels.join(", ") || "None"}
Comment Count: ${context.commentCount}

Repository Context:
- Architecture: ${context.architecture.join(", ") || "Standard structure"}
- Key Dependencies: ${context.dependencies.slice(0, 10).join(", ") || "Standard dependencies"}
- Known Entry Points: ${context.entryPoints.slice(0, 5).join(", ") || "Not identified"}
- Known Modules: ${context.modules.slice(0, 10).join(", ") || "Not identified"}

Deterministic Scoring Insights (Read-Only Context):
- Overall Recommendation Score: ${context.overallScore}/100
- Learning Score: ${context.learningScore}/100
- AI Relevance Score: ${context.aiRelevanceScore}/100
- Maintainer Friendliness: ${context.maintainerScore}/100

Issue Description:
${context.body ? context.body.slice(0, 3000) : "No description provided."}`,
    },
  ];
}
