import { env } from "./env";

export interface AIConfig {
  readonly provider: "ollama" | "openrouter";
  readonly model: string;
  readonly temperature: number;
  readonly timeoutMs: number;
  readonly retryCount: number;
  readonly maxTokens: number;
  readonly cacheTtlMs: number;
  readonly ollamaBaseUrl: string;
  readonly openrouter: {
    readonly apiKey: string;
    readonly baseUrl: string;
    readonly model: string;
    readonly httpReferer: string;
    readonly appName: string;
  };
}

export const AI_CONFIG: AIConfig = {
  provider: env.AI_PROVIDER as "ollama" | "openrouter",
  model: env.AI_PROVIDER === "openrouter" ? env.OPENROUTER_MODEL : env.OLLAMA_CHAT_MODEL,
  temperature: env.AI_TEMPERATURE,
  timeoutMs: env.AI_REQUEST_TIMEOUT ?? env.OLLAMA_TIMEOUT,
  retryCount: env.AI_MAX_RETRIES,
  maxTokens: env.AI_MAX_TOKENS,
  cacheTtlMs: env.CACHE_TTL * 1000,
  ollamaBaseUrl: env.OLLAMA_BASE_URL,
  openrouter: {
    apiKey: env.OPENROUTER_API_KEY ?? "",
    baseUrl: env.OPENROUTER_BASE_URL,
    model: env.OPENROUTER_MODEL,
    httpReferer: env.OPENROUTER_HTTP_REFERER,
    appName: env.OPENROUTER_APP_NAME,
  },
};

export const PROMPT_VERSIONS = {
  issueSummary: "v1",
  contributionPlan: "v1",
  repositorySummary: "v1",
  learningPath: "v1",
  conceptExtraction: "v1",
  complexityAnalysis: "v1",
} as const;
