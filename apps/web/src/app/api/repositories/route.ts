import { NextResponse } from "next/server";
import { getRepositoriesByNames } from "@openforge/github-client";
import { CURATED_REPOSITORIES } from "@openforge/config";

export async function GET() {
  try {
    const repositories = await getRepositoriesByNames(CURATED_REPOSITORIES);

    const enriched = repositories.map((repo) => {
      const config = CURATED_REPOSITORIES.find(
        (c) => c.owner === repo.owner?.login && c.name === repo.name
      );
      return { ...repo, category: config?.category ?? "Uncategorized" };
    });

    return NextResponse.json({ repositories: enriched });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch repositories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
