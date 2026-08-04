import { parseAIResponse } from "../parsers";
import type { IssueAnalysis } from "../schemas/issue-analysis";
import { IssueAnalysisSchema } from "../schemas/issue-analysis";
import { AIResponseParseError } from "../errors";

/**
 * Parses and validates raw AI provider output against IssueAnalysisSchema.
 * Handles markdown fences, trailing comments, and malformed JSON structures.
 */
export function parseIssueAnalysisResponse(rawContent: string, providerName: string = "ai-provider"): IssueAnalysis {
  try {
    // Clean raw json before parsing if confidence is out-of-range float/percentage string
    let cleaned = rawContent.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    const rawObject = JSON.parse(cleaned);

    // Pre-clamp confidence if present in raw json before strict schema parse
    if (typeof rawObject.confidence === "number") {
      rawObject.confidence = Math.max(0, Math.min(1, rawObject.confidence));
    }

    const parsed = IssueAnalysisSchema.parse(rawObject);
    
    // Normalize & sanitize parsed properties
    return {
      ...parsed,
      confidence: Math.max(0, Math.min(1, parsed.confidence ?? 0.8)),
      estimatedHours: Math.max(0.5, parsed.estimatedHours ?? 2),
      requiredSkills: parsed.requiredSkills ?? [],
      conceptsToLearn: parsed.conceptsToLearn ?? [],
      likelyFiles: parsed.likelyFiles ?? [],
      implementationStrategy: parsed.implementationStrategy ?? [],
      testingStrategy: parsed.testingStrategy ?? [],
      commonPitfalls: parsed.commonPitfalls ?? [],
      learningResources: parsed.learningResources ?? [],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new AIResponseParseError(providerName, `Issue analysis response parsing failed: ${error.message}`);
    }
    throw new AIResponseParseError(providerName, "Issue analysis response parsing failed due to unknown error");
  }
}
