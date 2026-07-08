"use client";

import { Sparkles } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  label?: string;
  regenerate?: boolean;
}

export function GenerateButton({ onClick, loading, label = "Generate AI Analysis", regenerate = false }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/10 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={loading ? "Generating AI analysis" : label}
    >
      <Sparkles className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
      {loading ? "Analyzing..." : regenerate ? "Regenerate" : label}
    </button>
  );
}
