import { getIssue } from "@openforge/github-client";
import { MentorService } from "@openforge/engineering-mentor";
import { standardResponse, errorResponse } from "@/lib/api-helper";

/**
 * @openapi
 * /api/repositories/{owner}/{repo}/issues/{number}/mentor/reading-order:
 *   get:
 *     summary: Retrieve derived reading order
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string; number: string }> }
) {
  try {
    const { owner, repo, number } = await params;
    const issueNum = parseInt(number, 10);

    if (!owner || !repo || isNaN(issueNum)) {
      return errorResponse("Invalid path parameters", 400);
    }

    const issueData = await getIssue(owner, repo, issueNum);
    if (!issueData) {
      return errorResponse("Issue not found", 404);
    }

    const session = await MentorService.generateMentorSession(owner, repo, {
      number: issueNum,
      title: issueData.issue.title,
      body: issueData.issue.body || ""
    });

    return standardResponse(session.readingOrder);
  } catch (error: any) {
    console.error("Mentor Reading Order error:", error);
    return errorResponse(error.message, 500);
  }
}
