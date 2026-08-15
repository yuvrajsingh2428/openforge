"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analyticsClient, AnalyticsEvents } from "@/lib/analytics";
import { onLCP, onCLS, onINP, onTTFB, onFCP } from "web-vitals";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize PostHog & event listeners once on mount
  useEffect(() => {
    analyticsClient.initialize();

    // Global Error Handler
    const handleError = (event: ErrorEvent) => {
      analyticsClient.captureException(event.error || event.message, {
        source: "window.onerror",
        filename: event.filename,
        lineno: event.lineno,
      });
    };

    // Global Unhandled Promise Rejection Handler
    const handleRejection = (event: PromiseRejectionEvent) => {
      analyticsClient.captureException(event.reason, {
        source: "unhandledrejection",
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    // Web Vitals Instrumentation
    try {
      onLCP((metric) => analyticsClient.track(AnalyticsEvents.WEB_VITALS_CAPTURED, { name: "LCP", value: metric.value, rating: metric.rating, delta: metric.delta }));
      onCLS((metric) => analyticsClient.track(AnalyticsEvents.WEB_VITALS_CAPTURED, { name: "CLS", value: metric.value, rating: metric.rating, delta: metric.delta }));
      onINP((metric) => analyticsClient.track(AnalyticsEvents.WEB_VITALS_CAPTURED, { name: "INP", value: metric.value, rating: metric.rating, delta: metric.delta }));
      onTTFB((metric) => analyticsClient.track(AnalyticsEvents.WEB_VITALS_CAPTURED, { name: "TTFB", value: metric.value, rating: metric.rating, delta: metric.delta }));
      onFCP((metric) => analyticsClient.track(AnalyticsEvents.WEB_VITALS_CAPTURED, { name: "FCP", value: metric.value, rating: metric.rating, delta: metric.delta }));
    } catch {
      // Ignore if web vitals not supported in environment
    }

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  // Track Page Views on route changes
  useEffect(() => {
    if (pathname) {
      const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
      analyticsClient.capturePageView(url);
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
