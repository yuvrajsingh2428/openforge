import type { Metadata } from "next";
import { getIssue } from "@openforge/github-client";
import { notFound } from "next/navigation";
import { IssueDetailsCard } from "@/features/issues/components/issue-details-card";
import { MentorDashboard } from "@/features/mentor/components/mentor-dashboard";
import { MentorService } from "@openforge/engineering-mentor";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

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

  // Asynchronously generate Mentor Session
  let mentorSession = null;
  let mentorError = null;

  try {
    mentorSession = await MentorService.generateMentorSession(owner, repo, {
      number: issueNumber,
      title: result.issue.title,
      body: result.issue.body || ""
    });
  } catch (error: any) {
    mentorError = error.message;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
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

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Engineering Mentor</h2>
        {mentorSession ? (
          <MentorDashboard session={mentorSession} />
        ) : (
          <div className="rounded-xl border border-destructive bg-destructive/10 p-6 flex gap-4">
            <AlertCircle className="h-6 w-6 text-destructive shrink-0" />
            <div>
              <h3 className="font-semibold text-destructive">AI Mentor Currently Offline</h3>
              <p className="text-sm text-muted-foreground mt-1">
                We couldn't generate a personalized mentor session. Reason: {mentorError || "Connection error."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
