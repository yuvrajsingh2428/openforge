"use client";

import { useState } from "react";
import type { ComplexityAnalysis, IssueContext } from "@openforge/ai-analysis";
import { GenerateButton } from "./generate-button";
import { AILoading } from "./ai-loading";
import { AIError } from "./ai-error";
import { AIUnavailable } from "./ai-unavailable";

interface ComplexityBadgeProps {
  context: IssueContext;
}

const LEVEL_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-400", label: "Low" },
  medium: { bg: "bg-yellow-500/15", text: "text-yellow-600 dark:text-yellow-400", label: "Medium" },
  high: { bg: "bg-orange-500/15", text: "text-orange-600 dark:text-orange-400", label: "High" },
  "very-high": { bg: "bg-red-500/15", text: "text-red-600 dark:text-red-400", label: "Very High" },
};

export function ComplexityBadge({ context }: ComplexityBadgeProps) {
  const [data, setData] = useState<ComplexityAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    setUnavailable(false);
    try {
      const res = await fetch("/api/ai/complexity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(context) });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else if (result.error?.includes("not running") || result.error?.includes("not installed")) {
        setUnavailable(true);
      } else {
        setError(result.error ?? "Analysis failed");
      }
    } catch {
      setError("Failed to connect to AI service");
    } finally {
      setLoading(false);
    }
  }

  if (unavailable) return <AIUnavailable />;
  if (loading) return <AILoading message="Estimating complexity..." />;
  if (error) return <AIError message={error} onRetry={generate} />;

  if (!data) {
    return <GenerateButton onClick={generate} loading={false} label="Estimate Complexity" />;
  }

  const style = LEVEL_STYLES[data.level] ?? LEVEL_STYLES.medium;

  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI Complexity</h3>
        <GenerateButton onClick={generate} loading={false} regenerate />
      </div>
      <div className="flex items-center gap-3">
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${style.bg} ${style.text}`}>
          {style.label}
        </span>
        <p className="text-sm text-muted-foreground flex-1">{data.reasoning}</p>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Contributing Factors</h4>
        <ul className="mt-1.5 space-y-1">{data.factors.map((f, i) => <li key={i} className="text-sm text-muted-foreground">• {f}</li>)}</ul>
      </div>
    </div>
  );
}
