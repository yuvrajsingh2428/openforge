import { AI_CONFIG } from "@openforge/config";
import type { IssueContext, AIAnalysisResult } from "../types";
import type { LearningPath } from "../schemas";
import { LearningPathSchema } from "../schemas";
import { getAIProvider } from "../providers/base";
import { InMemoryCache, buildCacheKey } from "../cache";
import { parseAIResponse } from "../parsers";
import { buildLearningPathPrompt, LEARNING_PATH_PROMPT_VERSION } from "../prompts/learning-path";

const cache = new InMemoryCache();

export async function generateLearningPath(context: IssueContext): Promise<AIAnalysisResult<LearningPath>> {
  const cacheKey = buildCacheKey("learning-path", `${context.repository}#${context.title}`, LEARNING_PATH_PROMPT_VERSION, AI_CONFIG.model);
  const cached = cache.get<LearningPath>(cacheKey);
  if (cached) {
    return { success: true, data: cached, error: null, cached: true, model: AI_CONFIG.model, durationMs: 0 };
  }

  const provider = getAIProvider();
  const availability = await provider.isAvailable();
  if (!availability.available) {
    return { success: false, data: null, error: availability.message, cached: false, model: AI_CONFIG.model, durationMs: 0 };
  }

  try {
    const messages = buildLearningPathPrompt(context);
    const response = await provider.chat(messages);
    const data = parseAIResponse(response.content, LearningPathSchema);
    cache.set(cacheKey, data);
    return { success: true, data, error: null, cached: false, model: response.model, durationMs: response.durationMs };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Learning path generation failed";
    return { success: false, data: null, error: message, cached: false, model: AI_CONFIG.model, durationMs: 0 };
  }
}
