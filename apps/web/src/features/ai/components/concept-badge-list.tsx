"use client";

import { useState } from "react";
import type { ConceptList, IssueContext } from "@openforge/ai-analysis";
import { GenerateButton } from "./generate-button";
import { AILoading } from "./ai-loading";
import { AIError } from "./ai-error";
import { AIUnavailable } from "./ai-unavailable";

interface ConceptBadgeListProps {
  context: IssueContext;
}

const CATEGORY_COLORS: Record<string, string> = {
  frameworks: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  libraries: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  patterns: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  algorithms: "bg-red-500/10 text-red-600 dark:text-red-400",
  protocols: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  languages: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  tools: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

export function ConceptBadgeList({ context }: ConceptBadgeListProps) {
  const [data, setData] = useState<ConceptList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    setUnavailable(false);
    try {
      const res = await fetch("/api/ai/concepts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(context) });
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
  if (loading) return <AILoading message="Extracting concepts..." />;
  if (error) return <AIError message={error} onRetry={generate} />;

  if (!data) {
    return <GenerateButton onClick={generate} loading={false} label="Extract Concepts" />;
  }

  const categories = Object.entries(data).filter(([, items]) => items.length > 0);

  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI Concepts</h3>
        <GenerateButton onClick={generate} loading={false} regenerate />
      </div>
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">No specific technical concepts detected.</p>
      ) : (
        <div className="space-y-3">
          {categories.map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase capitalize">{category}</h4>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {items.map((item) => (
                  <span key={item} className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category] ?? "bg-muted text-foreground"}`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
