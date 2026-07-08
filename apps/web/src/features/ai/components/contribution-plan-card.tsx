"use client";

import { useState } from "react";
import type { ContributionPlan, IssueContext } from "@openforge/ai-analysis";
import { GenerateButton } from "./generate-button";
import { AILoading } from "./ai-loading";
import { AIError } from "./ai-error";
import { AIUnavailable } from "./ai-unavailable";

interface ContributionPlanCardProps {
  context: IssueContext;
}

export function ContributionPlanCard({ context }: ContributionPlanCardProps) {
  const [data, setData] = useState<ContributionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    setUnavailable(false);
    try {
      const res = await fetch("/api/ai/contribution-plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(context) });
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
  if (loading) return <AILoading message="Generating contribution plan..." />;
  if (error) return <AIError message={error} onRetry={generate} />;

  if (!data) {
    return <GenerateButton onClick={generate} loading={false} label="Generate Contribution Plan" />;
  }

  const sections = [
    { title: "First Steps", items: data.firstSteps },
    { title: "Reading Order", items: data.readingOrder },
    { title: "Implementation", items: data.implementationChecklist },
    { title: "Testing", items: data.testingChecklist },
    { title: "Validation", items: data.validationChecklist },
  ];

  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI Contribution Plan</h3>
        <GenerateButton onClick={generate} loading={false} regenerate />
      </div>
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.title}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">{section.title}</h4>
            <ol className="mt-1.5 space-y-1 list-decimal list-inside">
              {section.items.map((item, i) => <li key={i} className="text-sm text-muted-foreground">{item}</li>)}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
