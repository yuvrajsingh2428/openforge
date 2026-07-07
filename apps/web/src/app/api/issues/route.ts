import { NextResponse } from "next/server";
import { getIssuesFromCuratedRepos } from "@openforge/github-client";
import { CURATED_REPOSITORIES } from "@openforge/config";

export async function GET() {
  try {
    const issues = await getIssuesFromCuratedRepos(CURATED_REPOSITORIES, 5);
    return NextResponse.json({ issues });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch issues";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
