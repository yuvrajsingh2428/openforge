import { ExternalLink, BookOpen } from "lucide-react";
import type { LearningResource } from "@openforge/ai-analysis";
import { generateFormattedResources } from "@openforge/ai-analysis";

interface LearningResourcesCardProps {
  resources: LearningResource[];
}

export function LearningResourcesCard({ resources }: LearningResourcesCardProps) {
  if (!resources || resources.length === 0) return null;

  const formatted = generateFormattedResources(resources);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
        <BookOpen className="h-4 w-4" aria-hidden="true" />
        Learning Resources
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {formatted.map((res, idx) => (
          <a
            key={idx}
            href={res.searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-lg border bg-muted/20 hover:bg-muted/50 transition-colors block space-y-1"
          >
            <div className="flex items-center justify-between font-medium text-xs text-foreground group-hover:text-primary transition-colors">
              <span className="truncate">{res.title}</span>
              <ExternalLink className="h-3 w-3 shrink-0 ml-1 text-muted-foreground group-hover:text-primary" />
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">{res.reason}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
