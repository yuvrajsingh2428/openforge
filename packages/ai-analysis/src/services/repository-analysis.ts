import { AI_CONFIG } from "@openforge/config";
import type { RepositoryContext, AIAnalysisResult } from "../types";
import type { RepositorySummary } from "../schemas";
import { RepositorySummarySchema } from "../schemas";
import { getAIProvider } from "../providers/base";
import { InMemoryCache, buildCacheKey } from "../cache";
import { parseAIResponse } from "../parsers";
import { buildRepositorySummaryPrompt, REPOSITORY_SUMMARY_PROMPT_VERSION } from "../prompts/repository-summary";

const cache = new InMemoryCache();

export async function generateRepositorySummary(context: RepositoryContext): Promise<AIAnalysisResult<RepositorySummary>> {
  const cacheKey = buildCacheKey("repo-summary", context.fullName, REPOSITORY_SUMMARY_PROMPT_VERSION, AI_CONFIG.model);
  const cached = cache.get<RepositorySummary>(cacheKey);
  if (cached) {
    return { success: true, data: cached, error: null, cached: true, model: AI_CONFIG.model, durationMs: 0 };
  }

  const provider = getAIProvider();
  const availability = await provider.isAvailable();
  if (!availability.available) {
    return { success: false, data: null, error: availability.message, cached: false, model: AI_CONFIG.model, durationMs: 0 };
  }

  try {
    const messages = buildRepositorySummaryPrompt(context);
    const response = await provider.chat(messages);
    const data = parseAIResponse(response.content, RepositorySummarySchema);
    cache.set(cacheKey, data);
    return { success: true, data, error: null, cached: false, model: response.model, durationMs: response.durationMs };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Repository analysis failed";
    return { success: false, data: null, error: message, cached: false, model: AI_CONFIG.model, durationMs: 0 };
  }
}
