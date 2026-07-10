import { NextResponse } from "next/server";
import { getIssue } from "@openforge/github-client";
import { scoreIssue } from "@openforge/recommendation-engine";
import { standardResponse, errorResponse } from "@/lib/api-helper";

function parseIssueId(id: string): { owner: string; repo: string; number: number } {
  if (id.includes(":")) {
    const [owner, repo, numStr] = id.split(":");
    return { owner, repo, number: parseInt(numStr, 10) };
  }
  if (id.includes("~")) {
    const [owner, repo, numStr] = id.split("~");
    return { owner, repo, number: parseInt(numStr, 10) };
  }
  const parts = id.split("-");
  const number = parseInt(parts.pop() || "0", 10);
  const owner = parts[0] || "";
  const repo = parts.slice(1).join("-") || "";
  return { owner, repo, number };
}

/**
 * @openapi
 * /api/recommendations/{issueId}/breakdown:
 *   get:
 *     summary: Retrieve recommendation score breakdown
 *     parameters:
 *       - name: issueId
 *         in: path
 *         required: true
 *         description: Format is owner-repo-number
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ issueId: string }> }
) {
  try {
    const { issueId } = await params;
    const { owner, repo, number } = parseIssueId(issueId);

    if (!owner || !repo || isNaN(number)) {
      return errorResponse("Invalid issue ID format. Use owner-repo-number", 400);
    }

    const issueData = await getIssue(owner, repo, number);
    if (!issueData) {
      return errorResponse("Issue not found", 404);
    }

    const score = scoreIssue(issueData.issue as any, "Frontend");
    return standardResponse({
      breakdown: score.breakdown,
      explanation: score.explanation
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
