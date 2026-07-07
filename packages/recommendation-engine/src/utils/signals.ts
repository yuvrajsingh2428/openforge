import type { Issue } from "@openforge/github-client";
import type { ScoringSignals } from "../types";

export function extractSignals(issue: Issue, category: string): ScoringSignals {
  const labels = issue.labels?.nodes ?? [];
  const repo = issue.repository;

  return {
    issueTitle: issue.title,
    issueBody: issue.body ?? "",
    issueState: issue.state,
    issueLabels: labels.map((l) => l.name.toLowerCase()),
    issueLabelColors: labels.map((l) => ({ name: l.name, color: l.color })),
    issueCreatedAt: new Date(issue.createdAt),
    issueUpdatedAt: issue.updatedAt ? new Date(issue.updatedAt) : null,
    issueClosedAt: issue.closedAt ? new Date(issue.closedAt) : null,
    issueCommentCount: issue.comments?.totalCount ?? 0,
    issueReactionCount: issue.reactions?.totalCount ?? 0,
    issueAssigneeCount: issue.assignees?.nodes.length ?? 0,
    issueAuthor: issue.author?.login ?? "unknown",
    issueMilestone: issue.milestone?.title ?? null,
    issueUrl: issue.url,
    issueNumber: issue.number,
    repoName: repo?.name ?? "",
    repoFullName: repo?.nameWithOwner ?? "",
    repoOwner: repo?.owner.login ?? "",
    repoStars: 0,
    repoForks: 0,
    repoOpenIssues: 0,
    repoLanguage: repo?.primaryLanguage?.name ?? null,
    repoTopics: [],
    repoUpdatedAt: null,
    repoHasLicense: false,
    repoDescription: "",
    category,
  };
}

export function enrichSignalsWithRepo(
  signals: ScoringSignals,
  repo: { stargazerCount: number; forkCount: number; openIssues?: { totalCount: number }; repositoryTopics?: { nodes: { topic: { name: string } }[] }; licenseInfo?: { name: string } | null; description?: string | null; updatedAt?: string }
): ScoringSignals {
  return {
    ...signals,
    repoStars: repo.stargazerCount,
    repoForks: repo.forkCount,
    repoOpenIssues: repo.openIssues?.totalCount ?? 0,
    repoTopics: repo.repositoryTopics?.nodes.map((n) => n.topic.name.toLowerCase()) ?? [],
    repoHasLicense: !!repo.licenseInfo,
    repoDescription: repo.description ?? "",
    repoUpdatedAt: repo.updatedAt ? new Date(repo.updatedAt) : null,
  };
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}
