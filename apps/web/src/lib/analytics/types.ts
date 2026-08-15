import type { ZodSchema } from "zod";

export type EventName = string;

export interface AnalyticsEvent<T = Record<string, any>> {
  name: EventName;
  properties: T;
  timestamp: string;
  anonymousId: string;
  sessionId?: string;
  version: string;
}

export interface AnalyticsProvider {
  name: string;
  initialize(config: AnalyticsConfig): void;
  track(event: AnalyticsEvent): Promise<boolean>;
  isInitialized(): boolean;
}

export interface AnalyticsConfig {
  apiKey?: string;
  host?: string;
  enabled: boolean;
  debug: boolean;
  environment: "development" | "production" | "test";
}

export interface QueueItem {
  id: string;
  event: AnalyticsEvent;
  attempts: number;
  createdAt: number;
}

export type MiddlewareFunction = (
  event: AnalyticsEvent,
  next: (event: AnalyticsEvent) => Promise<boolean>
) => Promise<boolean>;
