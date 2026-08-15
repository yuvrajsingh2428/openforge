import type { AnalyticsProvider, AnalyticsConfig, AnalyticsEvent } from "./types";
import posthog from "posthog-js";

export class PostHogProviderImpl implements AnalyticsProvider {
  public name = "PostHog";
  private initialized = false;

  public initialize(config: AnalyticsConfig): void {
    if (this.initialized) return;

    if (!config.enabled || !config.apiKey || typeof window === "undefined") {
      return;
    }

    try {
      posthog.init(config.apiKey, {
        api_host: config.host || "https://us.i.posthog.com",
        loaded: (ph) => {
          if (config.debug) ph.debug();
        },
        capture_pageview: false, // Pageviews are handled automatically via Router events
        capture_pageleave: true,
        autocapture: false,
        disable_session_recording: true, // Respect user privacy
        persistence: "localStorage",
      });
      this.initialized = true;
    } catch {
      this.initialized = false;
    }
  }

  public async track(event: AnalyticsEvent): Promise<boolean> {
    if (!this.initialized || typeof window === "undefined") {
      return false;
    }

    try {
      posthog.capture(event.name, {
        ...event.properties,
        $distinct_id: event.anonymousId,
        $current_url: typeof window !== "undefined" ? window.location.href : undefined,
        event_version: event.version,
        event_timestamp: event.timestamp,
      });
      return true;
    } catch {
      return false;
    }
  }

  public isInitialized(): boolean {
    return this.initialized;
  }
}
