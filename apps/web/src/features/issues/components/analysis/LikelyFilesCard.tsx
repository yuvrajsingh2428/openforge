import { FileCode } from "lucide-react";
import { predictFileDetails } from "@openforge/ai-analysis";

interface LikelyFilesCardProps {
  files: string[];
}

export function LikelyFilesCard({ files }: LikelyFilesCardProps) {
  if (!files || files.length === 0) return null;

  const detailed = predictFileDetails(files);

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
        <FileCode className="h-4 w-4" aria-hidden="true" />
        Likely Files Involved
      </h3>
      <div className="space-y-1.5">
        {detailed.map((file, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2 rounded-md bg-muted/40 font-mono text-xs text-foreground border"
          >
            <span className="truncate mr-2">{file.path}</span>
            <span className="text-[10px] uppercase font-sans tracking-wider text-muted-foreground bg-background px-1.5 py-0.5 rounded border shrink-0">
              {file.fileType}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
