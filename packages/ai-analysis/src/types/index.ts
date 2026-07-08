/** Result of an AI availability check */
export interface AIAvailabilityResult {
  readonly available: boolean;
  readonly provider: string;
  readonly model: string | null;
  readonly message: string;
}

/** Chat message for provider communication */
export interface AIChatMessage {
  readonly role: "system" | "user" | "assistant";
  readonly content: string;
}

/** Raw response from a provider */
export interface AIRawResponse {
  readonly content: string;
  readonly model: string;
  readonly durationMs: number;
}

/** Structured AI analysis result wrapper */
export interface AIAnalysisResult<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: string | null;
  readonly cached: boolean;
  readonly model: string;
  readonly durationMs: number;
}

/** Issue context passed to AI prompts */
export interface IssueContext {
  readonly title: string;
  readonly body: string;
  readonly labels: ReadonlyArray<string>;
  readonly repository: string;
  readonly language: string | null;
  readonly state: string;
  readonly commentCount: number;
}

/** Repository context passed to AI prompts */
export interface RepositoryContext {
  readonly name: string;
  readonly fullName: string;
  readonly description: string;
  readonly language: string | null;
  readonly stars: number;
  readonly forks: number;
  readonly topics: ReadonlyArray<string>;
  readonly hasLicense: boolean;
  readonly openIssueCount: number;
}

/** Complexity level */
export type ComplexityLevel = "low" | "medium" | "high" | "very-high";

/** AI Provider interface — the contract every provider must implement */
export interface AIProvider {
  readonly name: string;
  isAvailable(): Promise<AIAvailabilityResult>;
  chat(messages: AIChatMessage[], options?: { temperature?: number; timeoutMs?: number }): Promise<AIRawResponse>;
}
