import type { Metadata } from "next";
import { getRepository } from "@openforge/github-client";
import { notFound } from "next/navigation";
import { RepositoryDetailsCard } from "@/features/repositories/components/repository-details-card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface RepositoryDetailPageProps {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
}

export async function generateMetadata({ params }: RepositoryDetailPageProps): Promise<Metadata> {
  const { owner, repo } = await params;
  return {
    title: `${owner}/${repo} | OpenForge`,
    description: `Explore the ${owner}/${repo} repository on OpenForge. View stats, topics, and metadata.`,
  };
}

export default async function RepositoryDetailPage({ params }: RepositoryDetailPageProps) {
  const { owner, repo } = await params;

  const repository = await getRepository(owner, repo);

  if (!repository) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/repositories"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to repositories
      </Link>
      <RepositoryDetailsCard repository={repository} />
    </div>
  );
}
