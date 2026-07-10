import { NextResponse } from "next/server";
import { getIssue } from "@openforge/github-client";
import { MentorService } from "@openforge/engineering-mentor";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string; number: string }> }
) {
  try {
    const { owner, repo, number } = await params;
    const issueNum = parseInt(number, 10);

    const issueData = await getIssue(owner, repo, issueNum);
    if (!issueData) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const session = await MentorService.generateMentorSession(owner, repo, {
      number: issueNum,
      title: issueData.issue.title,
      body: issueData.issue.body || ""
    });

    return NextResponse.json(session.strategySteps);
  } catch (error: any) {
    console.error("Mentor Strategy error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
