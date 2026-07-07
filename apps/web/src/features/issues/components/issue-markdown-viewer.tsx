"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IssueMarkdownViewerProps {
  content: string;
}

export function IssueMarkdownViewer({ content }: IssueMarkdownViewerProps) {
  return (
    <div className="prose prose-sm prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-li:text-muted-foreground prose-th:text-foreground prose-td:text-muted-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
