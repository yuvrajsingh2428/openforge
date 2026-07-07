import { NextResponse } from "next/server";
import { getIssuesFromCuratedRepos } from "@openforge/github-client";
import { CURATED_REPOSITORIES } from "@openforge/config";
import { generateRecommendations } from "@openforge/recommendation-engine";

export async function GET() {
  try {
    const issues = await getIssuesFromCuratedRepos(CURATED_REPOSITORIES, 10);
    
    // Map repo nameWithOwner to category
    const categoryMap = new Map<string, string>();
    for (const repo of CURATED_REPOSITORIES) {
      categoryMap.set(`${repo.owner}/${repo.name}`, repo.category);
    }

    const recommendations = generateRecommendations(issues, categoryMap);
    
    return NextResponse.json({ recommendations });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch recommendations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
