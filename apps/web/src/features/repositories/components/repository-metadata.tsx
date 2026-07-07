import { Calendar, Scale, GitBranch, Globe } from "lucide-react";
import type { Repository } from "@openforge/github-client";

interface RepositoryMetadataProps {
  repository: Repository;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function RepositoryMetadata({ repository }: RepositoryMetadataProps) {
  const items: { icon: React.ReactNode; label: string; value: string }[] = [];

  if (repository.licenseInfo) {
    items.push({
      icon: <Scale className="h-4 w-4" aria-hidden="true" />,
      label: "License",
      value: repository.licenseInfo.spdxId ?? repository.licenseInfo.name,
    });
  }

  if (repository.updatedAt) {
    items.push({
      icon: <Calendar className="h-4 w-4" aria-hidden="true" />,
      label: "Last updated",
      value: formatDate(repository.updatedAt),
    });
  }

  if (repository.defaultBranchRef) {
    items.push({
      icon: <GitBranch className="h-4 w-4" aria-hidden="true" />,
      label: "Default branch",
      value: repository.defaultBranchRef.name,
    });
  }

  if (repository.homepageUrl) {
    items.push({
      icon: <Globe className="h-4 w-4" aria-hidden="true" />,
      label: "Homepage",
      value: repository.homepageUrl,
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2.5 text-sm">
          <span className="text-muted-foreground">{item.icon}</span>
          <div>
            <span className="text-muted-foreground">{item.label}: </span>
            {item.label === "Homepage" ? (
              <a
                href={item.value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline"
              >
                {item.value.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              <span className="text-foreground">{item.value}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
