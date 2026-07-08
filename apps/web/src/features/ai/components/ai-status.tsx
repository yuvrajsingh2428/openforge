"use client";

import { Bot, Check } from "lucide-react";

interface AIStatusProps {
  available: boolean;
  model?: string | null;
}

export function AIStatus({ available, model }: AIStatusProps) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
      {available ? (
        <>
          <Check className="h-3 w-3 text-emerald-500" aria-hidden="true" />
          <span className="text-emerald-600 dark:text-emerald-400">AI Ready</span>
          {model && <span className="text-muted-foreground">· {model}</span>}
        </>
      ) : (
        <>
          <Bot className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          <span className="text-muted-foreground">AI Offline</span>
        </>
      )}
    </div>
  );
}
