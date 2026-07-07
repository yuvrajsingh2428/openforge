interface RepositoryLanguageBadgeProps {
  name: string;
  color?: string | null;
}

export function RepositoryLanguageBadge({ name, color }: RepositoryLanguageBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span
        className="h-2.5 w-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color ?? "#6b7280" }}
        aria-hidden="true"
      />
      {name}
    </span>
  );
}
