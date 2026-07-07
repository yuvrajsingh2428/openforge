interface RepositoryTopicBadgeProps {
  name: string;
}

export function RepositoryTopicBadge({ name }: RepositoryTopicBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent/80">
      {name}
    </span>
  );
}
