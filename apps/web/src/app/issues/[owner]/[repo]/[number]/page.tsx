import type { Metadata } from "next";
import { getIssue } from "@openforge/github-client";
import { notFound } from "next/navigation";
import { IssueDetailsCard } from "@/features/issues/components/issue-details-card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface IssueDetailPageProps {
  params: Promise<{
    owner: string;
    repo: string;
    number: string;
  }>;
}

export async function generateMetadata({ params }: IssueDetailPageProps): Promise<Metadata> {
  const { owner, repo, number } = await params;
  return {
    title: `Issue #${number} · ${owner}/${repo} | OpenForge`,
    description: `View issue #${number} from ${owner}/${repo} on OpenForge.`,
  };
}

export default async function IssueDetailPage({ params }: IssueDetailPageProps) {
  const { owner, repo, number } = await params;
  const issueNumber = parseInt(number, 10);

  if (isNaN(issueNumber)) {
    notFound();
  }

  const result = await getIssue(owner, repo, issueNumber);

  if (!result) {
    notFound();
  }

  const issueWithRepo = {
    ...result.issue,
    repository: {
      name: result.repository.name,
      nameWithOwner: result.repository.nameWithOwner,
      owner: result.repository.owner,
      primaryLanguage: result.repository.primaryLanguage,
    },
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/issues"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to issues
      </Link>
      <IssueDetailsCard
        issue={issueWithRepo}
        repositoryName={result.repository.nameWithOwner}
      />
    </div>
  );
}
