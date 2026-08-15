import type { AnalyticsConfig, AnalyticsEvent, AnalyticsProvider } from "./types";
import { ANALYTICS_VERSION, ANONYMOUS_ID_KEY } from "./constants";
import { AnalyticsQueue } from "./queue";
import { PostHogProviderImpl } from "./provider";
import { MiddlewarePipeline, sanitizerMiddleware, validationMiddleware } from "./middleware";
import { isAnalyticsEnabled } from "./feature-flags";
import { AnalyticsEvents } from "./events";

export class AnalyticsClient {
  private static instance: AnalyticsClient | null = null;
  private provider: AnalyticsProvider;
  private queue: AnalyticsQueue;
  private pipeline: MiddlewarePipeline;
  private anonymousId: string;
  private initialized = false;

  private constructor() {
    this.provider = new PostHogProviderImpl();
    this.queue = new AnalyticsQueue();
    this.pipeline = new MiddlewarePipeline();

    // Register standard pipeline middleware
    this.pipeline.use(sanitizerMiddleware);
    this.pipeline.use(validationMiddleware);

    this.anonymousId = this.getOrCreateAnonymousId();
  }

  public static getInstance(): AnalyticsClient {
    if (!AnalyticsClient.instance) {
      AnalyticsClient.instance = new AnalyticsClient();
    }
    return AnalyticsClient.instance;
  }

  public initialize(customConfig?: Partial<AnalyticsConfig>): void {
    if (this.initialized) return;

    const apiKey = customConfig?.apiKey || process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = customConfig?.host || process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    const config: AnalyticsConfig = {
      apiKey,
      host,
      enabled: isAnalyticsEnabled() && Boolean(apiKey),
      debug: customConfig?.debug || process.env.NODE_ENV === "development",
      environment: (process.env.NODE_ENV as any) || "development",
    };

    if (config.enabled && apiKey) {
      this.provider.initialize(config);
      this.queue.setProvider(this.provider);
      this.initialized = true;

      // Capture App Started event on initial load
      this.track(AnalyticsEvents.APP_STARTED, {
        environment: config.environment,
      });
    }
  }

  public getAnonymousId(): string {
    return this.anonymousId;
  }

  public async track(name: string, properties: Record<string, any> = {}): Promise<boolean> {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: new Date().toISOString(),
      anonymousId: this.anonymousId,
      version: ANALYTICS_VERSION,
    };

    return this.pipeline.execute(event, async (processedEvent) => {
      this.queue.enqueue(processedEvent);
      return true;
    });
  }

  public capturePageView(path: string, title?: string, referrer?: string): void {
    this.track(AnalyticsEvents.PAGE_VIEWED, {
      path,
      title: title || (typeof document !== "undefined" ? document.title : undefined),
      referrer: referrer || (typeof document !== "undefined" ? document.referrer : undefined),
    });
  }

  public captureSearch(query: string, filters?: Record<string, any>, resultCount?: number, durationMs?: number): void {
    this.track(AnalyticsEvents.REPOSITORY_SEARCH, {
      query,
      filters,
      resultCount,
      durationMs,
    });
  }

  public captureRepositoryView(owner: string, repo: string, stars?: number, forks?: number): void {
    this.track(AnalyticsEvents.REPOSITORY_VIEWED, {
      owner,
      repo,
      stars,
      forks,
    });
  }

  public captureRepositoryHealth(owner: string, repo: string, healthScore?: number): void {
    this.track(AnalyticsEvents.REPOSITORY_HEALTH_VIEWED, {
      owner,
      repo,
      healthScore,
    });
  }

  public captureIssueView(owner: string, repo: string, number: number, title?: string): void {
    this.track(AnalyticsEvents.ISSUE_VIEWED, {
      owner,
      repo,
      number,
      title,
    });
  }

  public captureRecommendationClick(issueId: string, overallScore: number, rank?: number): void {
    this.track(AnalyticsEvents.RECOMMENDATION_CLICKED, {
      issueId,
      overallScore,
      rank,
    });
  }

  public captureAIRequest(
    type: string,
    provider: string,
    model: string,
    durationMs: number,
    success: boolean,
    cached?: boolean,
    temperature?: number,
    failureReason?: string
  ): void {
    const eventMap: Record<string, string> = {
      summary: AnalyticsEvents.AI_SUMMARY_GENERATED,
      contributionPlan: AnalyticsEvents.AI_CONTRIBUTION_PLAN_GENERATED,
      repositorySummary: AnalyticsEvents.AI_REPOSITORY_SUMMARY_GENERATED,
      concepts: AnalyticsEvents.AI_CONCEPT_EXTRACTION_GENERATED,
      complexity: AnalyticsEvents.AI_COMPLEXITY_ANALYSIS_GENERATED,
      learningPath: AnalyticsEvents.AI_LEARNING_PATH_GENERATED,
    };

    const eventName = eventMap[type] || AnalyticsEvents.AI_SUMMARY_GENERATED;

    this.track(eventName, {
      type,
      provider,
      model,
      durationMs,
      success,
      cached,
      temperature,
      failureReason,
    });
  }

  public captureMentorSession(owner: string, repo: string, number: number, section?: string): void {
    this.track(AnalyticsEvents.MENTOR_SESSION_STARTED, {
      owner,
      repo,
      number,
      section,
    });
  }

  public captureException(error: unknown, context?: Record<string, any>): void {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    this.track(AnalyticsEvents.UNHANDLED_ERROR, {
      message,
      stack,
      ...context,
    });
  }

  private getOrCreateAnonymousId(): string {
    if (typeof window === "undefined") {
      return "server_anon_id";
    }

    try {
      let anonId = localStorage.getItem(ANONYMOUS_ID_KEY);
      if (!anonId) {
        anonId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(ANONYMOUS_ID_KEY, anonId);
      }
      return anonId;
    } catch {
      return `anon_fallback_${Date.now()}`;
    }
  }
}

export const analyticsClient = AnalyticsClient.getInstance();
