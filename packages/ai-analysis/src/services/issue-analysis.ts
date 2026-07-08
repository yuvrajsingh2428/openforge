import { AI_CONFIG } from "@openforge/config";
import type { IssueContext, AIAnalysisResult } from "../types";
import type { IssueSummary, ContributionPlan, ComplexityAnalysis, ConceptList } from "../schemas";
import { IssueSummarySchema, ContributionPlanSchema, ComplexityAnalysisSchema, ConceptListSchema } from "../schemas";
import { getAIProvider } from "../providers/base";
import { InMemoryCache, buildCacheKey } from "../cache";
import { parseAIResponse } from "../parsers";
import { buildIssueSummaryPrompt, ISSUE_SUMMARY_PROMPT_VERSION } from "../prompts/issue-summary";
import { buildContributionPlanPrompt, CONTRIBUTION_PLAN_PROMPT_VERSION } from "../prompts/contribution-plan";
import { buildComplexityAnalysisPrompt, COMPLEXITY_ANALYSIS_PROMPT_VERSION } from "../prompts/complexity-analysis";
import { buildConceptExtractionPrompt, CONCEPT_EXTRACTION_PROMPT_VERSION } from "../prompts/concept-extraction";

const cache = new InMemoryCache();

async function runAnalysis<T>(
  cacheType: string,
  identifier: string,
  promptVersion: string,
  promptBuilder: () => ReturnType<typeof buildIssueSummaryPrompt>,
  schema: Parameters<typeof parseAIResponse<T>>[1],
): Promise<AIAnalysisResult<T>> {
  const cacheKey = buildCacheKey(cacheType, identifier, promptVersion, AI_CONFIG.model);
  const cached = cache.get<T>(cacheKey);
  if (cached) {
    return { success: true, data: cached, error: null, cached: true, model: AI_CONFIG.model, durationMs: 0 };
  }

  const provider = getAIProvider();
  const availability = await provider.isAvailable();
  if (!availability.available) {
    return { success: false, data: null, error: availability.message, cached: false, model: AI_CONFIG.model, durationMs: 0 };
  }

  try {
    const messages = promptBuilder();
    const response = await provider.chat(messages);
    const data = parseAIResponse(response.content, schema);
    cache.set(cacheKey, data);
    return { success: true, data, error: null, cached: false, model: response.model, durationMs: response.durationMs };
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI analysis failed";
    return { success: false, data: null, error: message, cached: false, model: AI_CONFIG.model, durationMs: 0 };
  }
}

export async function generateIssueSummary(context: IssueContext): Promise<AIAnalysisResult<IssueSummary>> {
  return runAnalysis(
    "issue-summary",
    `${context.repository}#${context.title}`,
    ISSUE_SUMMARY_PROMPT_VERSION,
    () => buildIssueSummaryPrompt(context),
    IssueSummarySchema,
  );
}

export async function generateContributionPlan(context: IssueContext): Promise<AIAnalysisResult<ContributionPlan>> {
  return runAnalysis(
    "contribution-plan",
    `${context.repository}#${context.title}`,
    CONTRIBUTION_PLAN_PROMPT_VERSION,
    () => buildContributionPlanPrompt(context),
    ContributionPlanSchema,
  );
}

export async function generateComplexityAnalysis(context: IssueContext): Promise<AIAnalysisResult<ComplexityAnalysis>> {
  return runAnalysis(
    "complexity",
    `${context.repository}#${context.title}`,
    COMPLEXITY_ANALYSIS_PROMPT_VERSION,
    () => buildComplexityAnalysisPrompt(context),
    ComplexityAnalysisSchema,
  );
}

export async function generateConceptExtraction(context: IssueContext): Promise<AIAnalysisResult<ConceptList>> {
  return runAnalysis(
    "concepts",
    `${context.repository}#${context.title}`,
    CONCEPT_EXTRACTION_PROMPT_VERSION,
    () => buildConceptExtractionPrompt(context),
    ConceptListSchema,
  );
}
