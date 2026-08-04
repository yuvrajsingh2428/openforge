"use client";

import { useEffect, useState } from "react";
import type { IssueAnalysis } from "@openforge/ai-analysis";
import { AlertCircle, RefreshCw } from "lucide-react";
import { IssueSummaryCard } from "./IssueSummaryCard";
import { DifficultyCard } from "./DifficultyCard";
import { RequiredSkillsCard } from "./RequiredSkillsCard";
import { ConceptsCard } from "./ConceptsCard";
import { LikelyFilesCard } from "./LikelyFilesCard";
import { ImplementationStrategyCard } from "./ImplementationStrategyCard";
import { TestingStrategyCard } from "./TestingStrategyCard";
import { LearningResourcesCard } from "./LearningResourcesCard";
import { PitfallsCard } from "./PitfallsCard";

interface IssueAnalysisPanelProps {
  owner: string;
  repo: string;
  number: number;
}

export function IssueAnalysisPanel({ owner, repo, number }: IssueAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<IssueAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/issues/${owner}/${repo}/${number}/analysis`);
      const json = await res.json();

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "Failed to load issue analysis");
      }

      setAnalysis(json.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching AI analysis";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [owner, repo, number]);

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-6 w-24 bg-muted rounded-full" />
        </div>
        <div className="h-16 bg-muted/60 rounded" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-24 bg-muted/50 rounded" />
          <div className="h-24 bg-muted/50 rounded" />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <h3 className="font-semibold text-sm">AI Educational Analysis Offline</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Unable to generate structured issue analysis. Reason: {error || "Analysis service unavailable"}
        </p>
        <button
          onClick={fetchAnalysis}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border bg-background hover:bg-muted transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Summary Header Card */}
      <IssueSummaryCard
        summary={analysis.summary}
        beginnerExplanation={analysis.beginnerExplanation}
        whyItMatters={analysis.whyItMatters}
        confidence={analysis.confidence}
        estimatedHours={analysis.estimatedHours}
      />

      {/* 2. Difficulty & Skill Prerequisites */}
      <div className="grid gap-6 md:grid-cols-2">
        <DifficultyCard difficulty={analysis.estimatedDifficulty} />
        <RequiredSkillsCard skills={analysis.requiredSkills} />
      </div>

      {/* 3. Concepts & Files Involved */}
      <div className="grid gap-6 md:grid-cols-2">
        <ConceptsCard concepts={analysis.conceptsToLearn} />
        <LikelyFilesCard files={analysis.likelyFiles} />
      </div>

      {/* 4. Strategy & Testing */}
      <ImplementationStrategyCard strategy={analysis.implementationStrategy} />
      <TestingStrategyCard testingStrategy={analysis.testingStrategy} />

      {/* 5. Pitfalls & Resources */}
      <PitfallsCard pitfalls={analysis.commonPitfalls} />
      <LearningResourcesCard resources={analysis.learningResources} />
    </div>
  );
}
