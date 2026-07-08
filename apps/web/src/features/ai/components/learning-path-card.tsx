"use client";

import { useState } from "react";
import type { LearningPath, IssueContext } from "@openforge/ai-analysis";
import { GenerateButton } from "./generate-button";
import { AILoading } from "./ai-loading";
import { AIError } from "./ai-error";
import { AIUnavailable } from "./ai-unavailable";

interface LearningPathCardProps {
  context: IssueContext;
}

export function LearningPathCard({ context }: LearningPathCardProps) {
  const [data, setData] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    setUnavailable(false);
    try {
      const res = await fetch("/api/ai/learning-path", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(context) });
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
  if (loading) return <AILoading message="Generating learning path..." />;
  if (error) return <AIError message={error} onRetry={generate} />;

  if (!data) {
    return <GenerateButton onClick={generate} loading={false} label="Generate Learning Path" />;
  }

  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI Learning Path</h3>
        <GenerateButton onClick={generate} loading={false} regenerate />
      </div>
      <div className="space-y-3">
        <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Prerequisites</h4><ul className="mt-1 space-y-1">{data.prerequisites.map((p, i) => <li key={i} className="text-sm text-muted-foreground">• {p}</li>)}</ul></div>
        <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Recommended Knowledge</h4><ul className="mt-1 space-y-1">{data.recommendedKnowledge.map((k, i) => <li key={i} className="text-sm text-muted-foreground">• {k}</li>)}</ul></div>
        <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Documentation</h4><ul className="mt-1 space-y-1">{data.documentation.map((d, i) => <li key={i} className="text-sm text-muted-foreground">• {d}</li>)}</ul></div>
        <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Concept Progression</h4><ol className="mt-1 space-y-1 list-decimal list-inside">{data.conceptProgression.map((c, i) => <li key={i} className="text-sm text-muted-foreground">{c}</li>)}</ol></div>
        <div className="rounded-md bg-muted/50 p-3"><span className="text-xs font-semibold text-muted-foreground uppercase">Estimated Time:</span><span className="ml-2 text-sm font-semibold">{data.estimatedHours}h</span></div>
      </div>
    </div>
  );
}
