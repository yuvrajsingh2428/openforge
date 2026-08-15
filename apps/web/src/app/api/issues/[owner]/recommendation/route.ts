import { getIssue } from "@openforge/github-client";
import { scoreIssue } from "@openforge/recommendation-engine";
import { CURATED_REPOSITORIES } from "@openforge/config";
import { standardResponse, errorResponse, sanitizeError } from "@/lib/api-helper";

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
 * /api/issues/{id}/recommendation:
 *   get:
 *     summary: Retrieve recommendation score for an issue
 *     parameters:
 *       - name: owner
 *         in: path
 *         required: true
 *         description: Format is owner-repo-number, owner:repo:number, or owner~repo~number
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string }> }
) {
  try {
    const { owner: id } = await params;
    const { owner, repo, number } = parseIssueId(id);

    if (!owner || !repo || isNaN(number)) {
      return errorResponse("Invalid issue ID format. Use owner-repo-number", 400);
    }

    const issueData = await getIssue(owner, repo, number);
    if (!issueData) {
      return errorResponse("Issue not found", 404);
    }

    const repoConfig = CURATED_REPOSITORIES.find(
      (r) => r.owner.toLowerCase() === owner.toLowerCase() && r.name.toLowerCase() === repo.toLowerCase()
    );
    const category = repoConfig?.category ?? "Frontend";

    const score = scoreIssue(issueData.issue as any, category);
    return standardResponse(score);
  } catch (error: unknown) {
    return errorResponse(sanitizeError(error, "Failed to calculate recommendation score"), 500);
  }
}
