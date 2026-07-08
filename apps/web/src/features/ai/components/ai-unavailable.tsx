import { CloudOff } from "lucide-react";

export function AIUnavailable() {
  return (
    <div className="rounded-lg border border-muted bg-muted/30 p-4">
      <div className="flex items-start gap-3">
        <CloudOff className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-foreground">AI Analysis Unavailable</p>
          <p className="text-sm text-muted-foreground mt-1">
            Enable Ollama locally to unlock AI-powered analysis.
            Run <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">ollama serve</code> then{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">ollama pull llama3.2</code> to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
