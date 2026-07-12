import { env } from "./env";

export interface AIConfig {
  readonly provider: "ollama";
  readonly model: string;
  readonly temperature: number;
  readonly timeoutMs: number;
  readonly retryCount: number;
  readonly cacheTtlMs: number;
  readonly ollamaBaseUrl: string;
}

export const AI_CONFIG: AIConfig = {
  provider: "ollama",
  model: "llama3.2",
  temperature: 0.3,
  timeoutMs: 60_000,
  retryCount: 2,
  cacheTtlMs: 30 * 60 * 1000, // 30 minutes
  ollamaBaseUrl: env.OLLAMA_BASE_URL,
} as const;

export const PROMPT_VERSIONS = {
  issueSummary: "v1",
  contributionPlan: "v1",
  repositorySummary: "v1",
  learningPath: "v1",
  conceptExtraction: "v1",
  complexityAnalysis: "v1",
} as const;
