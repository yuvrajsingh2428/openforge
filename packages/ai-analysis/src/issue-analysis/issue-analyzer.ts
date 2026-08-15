import { AI_CONFIG } from "@openforge/config";
import { getIssue } from "@openforge/github-client";
import type { AIAnalysisResult } from "../types";
import type { IssueAnalysis } from "../schemas/issue-analysis";
import { getAIProvider } from "../providers/base";
import { InMemoryCache, buildCacheKey } from "../cache";
import { buildIssueAnalysisContext } from "./context-builder";
import { buildIssueAnalysisPrompt, ISSUE_ANALYSIS_PROMPT_VERSION } from "../prompts/issue-analysis";
import { parseIssueAnalysisResponse } from "./response-parser";

const cache = new InMemoryCache(24 * 60 * 60 * 1000); // 24 Hours TTL

export async function analyzeIssue(
  owner: string,
  repo: string,
  issueNumber: number,
): Promise<AIAnalysisResult<IssueAnalysis>> {
  const provider = getAIProvider();
  const cacheIdentifier = `${owner}/${repo}#${issueNumber}`;
  const cacheKey = buildCacheKey(
    "issue-analysis",
    cacheIdentifier,
    ISSUE_ANALYSIS_PROMPT_VERSION,
    `${provider.name}:${AI_CONFIG.model}`,
  );

  // 1. Check cache
  const cached = cache.get<IssueAnalysis>(cacheKey);
  if (cached) {
    return {
      success: true,
      data: cached,
      error: null,
      cached: true,
      model: AI_CONFIG.model,
      durationMs: 0,
    };
  }

  // 2. Check Provider availability
  const availability = await provider.isAvailable();
  if (!availability.available) {
    return {
      success: false,
      data: null,
      error: availability.message,
      cached: false,
      model: AI_CONFIG.model,
      durationMs: 0,
    };
  }

  // 3. Fetch Issue data from GitHub
  const issueResult = await getIssue(owner, repo, issueNumber);
  if (!issueResult) {
    return {
      success: false,
      data: null,
      error: `Issue #${issueNumber} not found in ${owner}/${repo}`,
      cached: false,
      model: AI_CONFIG.model,
      durationMs: 0,
    };
  }

  try {
    // 4. Build deterministic context
    const context = await buildIssueAnalysisContext(owner, repo, issueResult.issue);

    // 5. Build prompt & query AI provider
    const messages = buildIssueAnalysisPrompt(context);
    const response = await provider.chat(messages);

    // 6. Parse and validate structured output
    const data = parseIssueAnalysisResponse(response.content, provider.name);

    // 7. Store in cache (24h TTL)
    cache.set(cacheKey, data);

    return {
      success: true,
      data,
      error: null,
      cached: false,
      model: response.model,
      durationMs: response.durationMs,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Intelligent issue analysis failed";
    return {
      success: false,
      data: null,
      error: message,
      cached: false,
      model: AI_CONFIG.model,
      durationMs: 0,
    };
  }
}
