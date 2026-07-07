import Link from "next/link";

interface IssueRepositoryBadgeProps {
  nameWithOwner: string;
  language?: string | null;
  languageColor?: string | null;
}

export function IssueRepositoryBadge({ nameWithOwner, language, languageColor }: IssueRepositoryBadgeProps) {
  const [owner, name] = nameWithOwner.split("/");
  return (
    <Link
      href={`/repositories/${owner}/${name}`}
      className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent/80"
    >
      {language && (
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: languageColor ?? "#6b7280" }}
          aria-hidden="true"
        />
      )}
      {nameWithOwner}
    </Link>
  );
}
