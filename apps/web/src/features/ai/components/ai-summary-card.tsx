"use client";

import { useState } from "react";
import type { IssueSummary, IssueContext } from "@openforge/ai-analysis";
import { GenerateButton } from "./generate-button";
import { AILoading } from "./ai-loading";
import { AIError } from "./ai-error";
import { AIUnavailable } from "./ai-unavailable";

interface AISummaryCardProps {
  context: IssueContext;
}

export function AISummaryCard({ context }: AISummaryCardProps) {
  const [data, setData] = useState<IssueSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    setUnavailable(false);
    try {
      const res = await fetch("/api/ai/summary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(context) });
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
  if (loading) return <AILoading message="Generating issue summary..." />;
  if (error) return <AIError message={error} onRetry={generate} />;

  if (!data) {
    return <GenerateButton onClick={generate} loading={false} label="Generate Issue Summary" />;
  }

  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI Issue Summary</h3>
        <GenerateButton onClick={generate} loading={false} regenerate />
      </div>
      <div className="space-y-3">
        <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">What</h4><p className="text-sm mt-1">{data.what}</p></div>
        <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Why It Matters</h4><p className="text-sm mt-1">{data.why}</p></div>
        <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Expected Changes</h4><ul className="mt-1 space-y-1">{data.expectedChanges.map((c, i) => <li key={i} className="text-sm text-muted-foreground">• {c}</li>)}</ul></div>
        <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Technologies</h4><div className="flex flex-wrap gap-1.5 mt-1">{data.technologies.map((t) => <span key={t} className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{t}</span>)}</div></div>
      </div>
    </div>
  );
}
