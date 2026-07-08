"use client";

import { useState } from "react";
import type { RepositorySummary, RepositoryContext } from "@openforge/ai-analysis";
import { GenerateButton } from "./generate-button";
import { AILoading } from "./ai-loading";
import { AIError } from "./ai-error";
import { AIUnavailable } from "./ai-unavailable";

interface RepositorySummaryCardProps {
  context: RepositoryContext;
}

export function RepositorySummaryCard({ context }: RepositorySummaryCardProps) {
  const [data, setData] = useState<RepositorySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    setUnavailable(false);
    try {
      const res = await fetch("/api/ai/repository-summary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(context) });
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
  if (loading) return <AILoading message="Analyzing repository..." />;
  if (error) return <AIError message={error} onRetry={generate} />;

  if (!data) {
    return <GenerateButton onClick={generate} loading={false} label="Generate Repository Summary" />;
  }

  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI Repository Summary</h3>
        <GenerateButton onClick={generate} loading={false} regenerate />
      </div>
      <div className="space-y-3">
        <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Purpose</h4><p className="text-sm mt-1">{data.purpose}</p></div>
        <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Architecture</h4><p className="text-sm mt-1">{data.architecture}</p></div>
        <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Key Technologies</h4><div className="flex flex-wrap gap-1.5 mt-1">{data.keyTechnologies.map((t) => <span key={t} className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{t}</span>)}</div></div>
        <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Contributor Expectations</h4><p className="text-sm mt-1">{data.contributorExpectations}</p></div>
        <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Learning Opportunities</h4><ul className="mt-1 space-y-1">{data.learningOpportunities.map((o, i) => <li key={i} className="text-sm text-muted-foreground">• {o}</li>)}</ul></div>
      </div>
    </div>
  );
}
